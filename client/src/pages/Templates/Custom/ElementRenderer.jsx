// src/pages/Templates/Custom/ElementRenderer.jsx
// Decides which element component to render based on element.type.
// Used by CustomCanvas both in editor and read-only (published) mode.

import React from "react";
import { EL } from "./constants";
import {
  HeadingElement,
} from "./elements/HeadingElement";
import { ParagraphElement } from "./elements/ParagraphElement";
import { ButtonElement }    from "./elements/ButtonElement";
import {
  ImageElement,
  DividerElement,
  SpacerElement,
  CardElement,
  VideoElement,
  NavbarElement,
} from "./elements/index.jsx";

/**
 * @param {object} props
 * @param {object}   props.element       – element object from customLayout
 * @param {boolean}  props.isEditing     – true = double-clicked / inline edit mode
 * @param {boolean}  props.readOnly      – true = published view (no edit UI)
 * @param {Function} props.onContentChange – (newContent | {field:value}) => void
 * @param {Function} props.onSrcChange   – (url) => void  (image only)
 * @param {Array}    props.pages         – all pages (navbar needs this)
 * @param {string}   props.activePage    – current page id (navbar)
 * @param {Function} props.onPageChange  – (pageId) => void (navbar)
 */
export function ElementRenderer({
  element,
  isEditing  = false,
  readOnly   = false,
  onContentChange,
  onSrcChange,
  pages       = [],
  activePage  = null,
  onPageChange,
}) {
  const props = { element, isEditing, readOnly, onContentChange };

  switch (element.type) {
    case EL.HEADING:
      return <HeadingElement {...props} />;
    case EL.PARAGRAPH:
      return <ParagraphElement {...props} />;
    case EL.BUTTON:
      return <ButtonElement {...props} />;
    case EL.IMAGE:
      return <ImageElement {...props} onSrcChange={onSrcChange} />;
    case EL.DIVIDER:
      return <DividerElement {...props} />;
    case EL.SPACER:
      return <SpacerElement {...props} />;
    case EL.CARD:
      return <CardElement {...props} />;
    case EL.VIDEO:
      return <VideoElement {...props} />;
    case EL.NAVBAR:
      return (
        <NavbarElement
          {...props}
          pages={pages}
          activePage={activePage}
          onPageChange={onPageChange}
        />
      );
    default:
      return (
        <div style={{ padding: 12, background: "#fef9c3", borderRadius: 6, fontSize: 12, color: "#92400e" }}>
          Unknown element type: {element.type}
        </div>
      );
  }
}