import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

function normalizeYoutubeUrl(input) {
  if (!input) return null;

  const value = input.trim();

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.split("/shorts/")[1]?.split("/")[0]?.trim();
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (url.pathname.startsWith("/embed/")) {
        return value;
      }
    }

    return null;
  } catch {
    return null;
  }
}

const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-embed="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-youtube-embed": "true",
        class: "editor-embed editor-embed-youtube",
      },
      [
        "iframe",
        {
          src: HTMLAttributes.src,
          width: "100%",
          height: "400",
          frameborder: "0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: "true",
          referrerpolicy: "strict-origin-when-cross-origin",
        },
      ],
    ];
  },
});

const TelegramEmbed = Node.create({
  name: "telegramEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-telegram-embed="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-telegram-embed": "true",
        "data-url": HTMLAttributes.url,
        class: "editor-embed editor-embed-telegram",
      },
      [
        "a",
        {
          href: HTMLAttributes.url,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        HTMLAttributes.url || "Telegram post",
      ],
    ];
  },
});

function ToolbarButton({ type = "button", onClick, children }) {
  return (
    <button type={type} className="editor-toolbar-btn" onClick={onClick}>
      {children}
    </button>
  );
}

function StoryEditor({ label, value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image,
      YoutubeEmbed,
      TelegramEmbed,
    ],
    content: value?.json || {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange({
        json: currentEditor.getJSON(),
        html: currentEditor.getHTML(),
      });
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextJson = value?.json;
    if (!nextJson) return;

    const currentJson = editor.getJSON();

    if (JSON.stringify(currentJson) !== JSON.stringify(nextJson)) {
      editor.commands.setContent(nextJson, false);
    }
  }, [editor, value]);

  function handleSetLink() {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Вставьте ссылку", previousUrl);

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function handleInsertImage() {
    if (!editor) return;

    const url = window.prompt("Вставьте URL изображения");

    if (!url || !url.trim()) return;

    editor.chain().focus().setImage({ src: url.trim() }).run();
  }

  function handleInsertYoutube() {
    if (!editor) return;

    const rawUrl = window.prompt("Вставьте ссылку на YouTube или Shorts");
    const embedUrl = normalizeYoutubeUrl(rawUrl);

    if (!embedUrl) {
      window.alert("Не удалось распознать ссылку YouTube.");
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: "youtubeEmbed",
        attrs: { src: embedUrl },
      })
      .run();
  }

  function handleInsertTelegram() {
    if (!editor) return;

    const rawUrl = window.prompt("Вставьте ссылку на Telegram-пост");

    if (!rawUrl || !rawUrl.trim()) return;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "telegramEmbed",
        attrs: { url: rawUrl.trim() },
      })
      .run();
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="story-editor">
      {label ? <div className="story-editor-label">{label}</div> : null}

      <div className="editor-toolbar">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}>
          Ж
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}>
          К
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Список
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Список
        </ToolbarButton>

        <ToolbarButton onClick={handleSetLink}>Ссылка</ToolbarButton>
        <ToolbarButton onClick={handleInsertImage}>Картинка</ToolbarButton>
        <ToolbarButton onClick={handleInsertYoutube}>YouTube</ToolbarButton>
        <ToolbarButton onClick={handleInsertTelegram}>Telegram</ToolbarButton>
      </div>

      <div className="editor-surface">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default StoryEditor;