import type {Page} from '@playwright/test';

import {expect, test} from '@playwright/test';

import {BASE_URL} from '../../constants';

const PROJECTS_URL = 'https://expert.yandex.ru/expert/projects';
const CHAT_URL = `${PROJECTS_URL}/example/iframe`;
const OTHER_CHAT_URL = `${PROJECTS_URL}/example-other/iframe`;

test.beforeEach(async ({page}) => {
    await page.route(`${PROJECTS_URL}/*/iframe**`, (route) =>
        route.fulfill({
            contentType: 'text/html',
            body: `<!doctype html><input aria-label="Chat input"><ul></ul>
                <script>
                    window.addEventListener('test-chat-ready', () => {
                        window.addEventListener('message', ({data}) => {
                            if (data.type === 'send-message') {
                                const message = document.createElement('li');
                                message.textContent = data.payload.text;
                                document.querySelector('ul').append(message);
                            }
                        });
                        parent.postMessage({type: 'chat-mounted'}, '*');
                    });
                </script>`,
        }),
    );
    await page.goto(
        `${BASE_URL}/iframe.html?id=components-neuroexpertmodal--neuro-expert-modal&viewMode=story`,
    );
});

function getChat(page: Page) {
    const iframe = page.locator('.dc-neuro-expert-modal iframe');
    const chat = iframe.contentFrame();
    const input = chat.getByRole('textbox', {name: 'Chat input'});
    const messages = chat.getByRole('listitem');
    const finishLoading = () =>
        input.evaluate((element) => {
            const frame = element.ownerDocument.defaultView;
            frame?.dispatchEvent(new Event('test-chat-ready'));
        });

    return {iframe, input, messages, finishLoading};
}

test('waits for the new chat to mount before sending the first question', async ({page}) => {
    const {iframe, input, messages, finishLoading} = getChat(page);

    await page.getByRole('button', {name: 'Open empty chat'}).click();
    await expect(iframe).toHaveAttribute('src', `${CHAT_URL}?createChatOnInit=true`);
    await finishLoading();
    await expect(page.locator('.dc-neuro-expert-modal__loader')).toHaveCount(0);
    await input.fill('A question draft');
    await expect(messages).toHaveCount(0);
    await page.locator('.g-dialog-btn-close__btn').click();

    await page.getByRole('button', {name: 'Open with a question'}).click();
    await expect(iframe).toHaveAttribute('src', CHAT_URL);
    await expect(page.locator('.dc-neuro-expert-modal__loader')).toBeVisible();
    await finishLoading();
    await expect(messages).toHaveText('First question');
});

test('keeps a previous question out of a different project', async ({page}) => {
    const {iframe, input, messages, finishLoading} = getChat(page);
    const openChat = page.getByRole('button', {name: 'Open with a question'});
    const switchProject = page.getByRole('button', {name: 'Switch project', includeHidden: true});

    await openChat.click();
    await expect(iframe).toHaveAttribute('src', CHAT_URL);
    await finishLoading();
    await expect(messages).toHaveText('First question');

    for (const url of [OTHER_CHAT_URL, CHAT_URL]) {
        // Simulate the host application changing projects while its dialog is open.
        await switchProject.evaluate((button: HTMLButtonElement) => button.click());
        await expect(iframe).toHaveAttribute('src', url);
        await finishLoading();
        await expect(page.locator('.dc-neuro-expert-modal__loader')).toHaveCount(0);
        await input.fill('A question draft');
        await expect(messages).toHaveCount(0);
    }

    await page.locator('.g-dialog-btn-close__btn').click();
    await openChat.click();
    await expect(messages).toHaveText('First question');
});
