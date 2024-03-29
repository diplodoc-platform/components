## Breaking

- Update to `@gravity-ui/uilit@5`
- Remove peer dependency on `@doc-tools/transform` <br>
  `@doc-tools/transform` js and css bundles should be attached directly to final projects
- `DISLIKE_VARIANTS` not exported from package. Use `i18n['feedback-variants']` instead.
- Prop `lang` war removed from component. Now you should use `configure` helper
- Enum `Vcs` renamed to `VcsType`

  ```js
  import {configure} from '@doc-tools/components';

  configure({
    lang: 'ru',
  });
  ```

- Removed `assets` export. All icons are private now. Use icons from gravity-ui instead.

### BookmarkButton

- `bookmarkedPage` prop was changed to `isBookmarked`. (Same as `isLiked`, `isDislaked` in Feedback component)
- `onChangeBookmarkPage` renamed to `onBookmark`

### Contributors

- Removed `lang` prop

### Control

- Replace `setRef` prop with `ref` (using forwardRef now)

### Controls

- Removed `lang` prop
- Removed `isVerticalView`, `controlSize`, `popupPosition` prop. Configure it with `ControlsLayout` wrapper component
  ```jsx
  <ControlsLayout isVerticalView={isVerticalView} controlSize={controlSize}>
    <Controls />
  </ControlsLayout>
  ```
- Prop `showEditControl` replaced by `hideEditControl`

### DividerControl

- Removed `size`, `isVerticalView` props
- Value for `size`, `isVerticalView` now stored in `ControlsLayoutContext`

### FullScreenControl

- Removed `lang` prop
- Removed `size`, `isVerticalView`, `className`, `popupPosition` props
- Value for `size`, `isVerticalView`, `popupPosition` now stored in `ControlsLayoutContext`
- Value for `className` now stored in `ControlsLayoutContext.controlClassName` prop
- Icon replaced with equal from `@gravity-ui/uikit`

### LangControl

- Prop `onChangeLang` is required now
- Removed `size`, `isVerticalView`, `className`, `popupPosition` props
- Value for `size`, `isVerticalView`, `popupPosition` now stored in `ControlsLayoutContext`
- Value for `className` now stored in `ControlsLayoutContext.controlClassName` prop
- Icon replaced with equal from `@gravity-ui/uikit`

### PdfControl

- Prop `pdfLink` is required now
- Removed `lang` prop
- Removed `size`, `isVerticalView`, `className`, `popupPosition` props
- Value for `size`, `isVerticalView`, `popupPosition` now stored in `ControlsLayoutContext`
- Value for `className` now stored in `ControlsLayoutContext.controlClassName` prop

### SettingsControl

- Removed `lang` prop
- Removed `size`, `isVerticalView`, `className`, `popupPosition` props
- Value for `size`, `isVerticalView`, `popupPosition` now stored in `ControlsLayoutContext`
- Value for `className` now stored in `ControlsLayoutContext.controlClassName` prop

### SinglePageControl

- Prop `onChange` is required now
- Removed `lang` prop
- Removed `size`, `isVerticalView`, `className`, `popupPosition` props
- Value for `size`, `isVerticalView`, `popupPosition` now stored in `ControlsLayoutContext`
- Value for `className` now stored in `ControlsLayoutContext.controlClassName` prop
- Icons replaced with equal from `@gravity-ui/uikit`

### DocLayout

- Removed `lang` prop
-

### DocLeadingPage

- Removed `lang` prop

### DocPageTitle

- Ownership on bookmarks was removed.
  Bookmarks should be passed as children.
- Removed `bookmarkedPage`, `onChangeBookmarkPage` props.

### EditButton

- Was removed in favor of EditControl

### ErrorPage

- Removed `lang` prop

### Feedback

- Removed `lang` prop
- Removed `singlePage` prop
- Removed `size`, `isVerticalView`, `className`, `popupPosition` props
- Removed `dislikeVariants` prop. Variants should be configured via `configure` util
  ```js
  configure({
    loc: {
      en: {
        'feedback-variants': {
          variant1: 'test1',
        },
      },
      ru: {
        'feedback-variants': {
          variant1: 'текс1',
        },
      },
    },
  });
  ```
- Value for `size`, `isVerticalView`, `popupPosition` now stored in `ControlsLayoutContext`
- Value for `className` now stored in `ControlsLayoutContext.controlClassName` prop
- Icons replaced with equal from `@gravity-ui/uikit`

### MiniToc

- Removed `lang` prop
- MiniToc returns `null` on empty headings. (Previously it render useless title)

### SearchBar

- Removed `lang` prop
- Icons replaced with equal from `@gravity-ui/uikit`

### SearchItem

- Removed `lang` prop

### SearchPage

- Removed `lang` prop

### Subscribe

- Prop `onSubscribe` is required now
- Removed `lang` prop
- Removed `size`, `isVerticalView`, `className`, `popupPosition` props
- Value for `size`, `isVerticalView`, `popupPosition` now stored in `ControlsLayoutContext`
- Value for `className` now stored in `ControlsLayoutContext.controlClassName` prop

### Toc

- Removed `lang` prop

### TocNavPanel

- Removed `lang` prop
