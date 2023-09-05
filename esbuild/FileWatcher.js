const {watch} = require('node:fs');

class FileWatcher {
    constructor(watching) {
        this.watching = watching;
    }

    async watch(files, handle, dispose) {
        files.forEach((file) => {
            if (this.watching) {
                watch(file, (event) => {
                    if (event === 'change') {
                        // eslint-disable-next-line no-console
                        handle(file).catch(console.error);
                    } else {
                        dispose(file);
                    }
                });
            } else {
                dispose(file);
            }
        });
    }
}

module.exports = {
    FileWatcher,
};
