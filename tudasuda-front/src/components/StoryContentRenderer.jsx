function isValidNode(node) {
  return node && typeof node === "object" && typeof node.type === "string";
}

function getTextAlign(style) {
  if (!style) return undefined;
  return style.textAlign || undefined;
}

function renderMarks(textNode, index) {
  const text = textNode.text || "";
  const marks = Array.isArray(textNode.marks) ? textNode.marks : [];

  return marks.reduce((acc, mark, markIndex) => {
    const key = `${index}-${markIndex}`;

    switch (mark.type) {
      case "bold":
        return <strong key={key}>{acc}</strong>;

      case "italic":
        return <em key={key}>{acc}</em>;

      case "link":
        return (
          <a
            key={key}
            href={mark.attrs?.href || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {acc}
          </a>
        );

      default:
        return <span key={key}>{acc}</span>;
    }
  }, text);
}

function renderInlineNode(node, index) {
  if (!isValidNode(node)) return null;

  if (node.type === "text") {
    return <span key={index}>{renderMarks(node, index)}</span>;
  }

  if (node.type === "hardBreak") {
    return <br key={index} />;
  }

  return null;
}

function renderChildren(content = []) {
  return content.map((child, index) => renderInlineNode(child, index));
}

function StoryContentRenderer({ contentJson, fallbackHtml }) {
  if (
    contentJson &&
    typeof contentJson === "object" &&
    Array.isArray(contentJson.content)
  ) {
    return (
      <div className="story-page-body story-rich-content">
        {contentJson.content.map((node, index) => {
          if (!isValidNode(node)) return null;

          switch (node.type) {
            case "paragraph":
              return (
                <p
                  key={index}
                  style={{ textAlign: getTextAlign(node.attrs) }}
                >
                  {renderChildren(node.content)}
                </p>
              );

            case "heading":
              if (node.attrs?.level === 2) {
                return (
                  <h2
                    key={index}
                    style={{ textAlign: getTextAlign(node.attrs) }}
                  >
                    {renderChildren(node.content)}
                  </h2>
                );
              }

              if (node.attrs?.level === 3) {
                return (
                  <h3
                    key={index}
                    style={{ textAlign: getTextAlign(node.attrs) }}
                  >
                    {renderChildren(node.content)}
                  </h3>
                );
              }

              return (
                <h2
                  key={index}
                  style={{ textAlign: getTextAlign(node.attrs) }}
                >
                  {renderChildren(node.content)}
                </h2>
              );

            case "bulletList":
              return (
                <ul key={index}>
                  {(node.content || []).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {(item.content || []).map((paragraph, paragraphIndex) => {
                        if (paragraph.type === "paragraph") {
                          return (
                            <span key={paragraphIndex}>
                              {renderChildren(paragraph.content)}
                            </span>
                          );
                        }

                        return null;
                      })}
                    </li>
                  ))}
                </ul>
              );

            case "orderedList":
              return (
                <ol key={index}>
                  {(node.content || []).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {(item.content || []).map((paragraph, paragraphIndex) => {
                        if (paragraph.type === "paragraph") {
                          return (
                            <span key={paragraphIndex}>
                              {renderChildren(paragraph.content)}
                            </span>
                          );
                        }

                        return null;
                      })}
                    </li>
                  ))}
                </ol>
              );

            case "image":
              return node.attrs?.src ? (
                <figure key={index} className="story-content-image">
                  <img
                    src={node.attrs.src}
                    alt={node.attrs.alt || ""}
                  />
                </figure>
              ) : null;

            case "youtubeEmbed":
              return node.attrs?.src ? (
                <div key={index} className="story-content-embed youtube">
                  <iframe
                    src={node.attrs.src}
                    title={`youtube-${index}`}
                    width="100%"
                    height="420"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : null;

            case "telegramEmbed":
              return node.attrs?.url ? (
                <div key={index} className="story-content-embed telegram">
                  <a
                    href={node.attrs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {node.attrs.url}
                  </a>
                </div>
              ) : null;

            default:
              return null;
          }
        })}
      </div>
    );
  }

  if (fallbackHtml?.trim()) {
    return (
      <div
        className="story-page-body story-rich-content"
        dangerouslySetInnerHTML={{ __html: fallbackHtml }}
      />
    );
  }

  return null;
}

export default StoryContentRenderer;