/**
 * @module
 */

/**
 * Parcourt tous les élements de la page courante (même ceux dans un
 * <code>template</code>).
 *
 * @returns {Array.<HTMLElement>} La liste des éléments.
 */
const walk = function () {
    return [...document.querySelectorAll("*")].flatMap((element) => {
        return "TEMPLATE" === element.tagName
                                    ? [...element.content.querySelectorAll("*")]
                                    : element;
    });
};

/**
 * Le nom de la page courante (récupérée à partir du répertoire).
 *
 * @constant {string}
 */
const PAGE = location.pathname.slice(1, location.pathname.indexOf("/", 1));

for (const element of walk()) {
    for (const attribute of element.attributes) {
        if (!attribute.name.startsWith("data-i18n-")) {
            continue;
        }

        const place = attribute.name.slice(10);
        let key;
        if ("" !== attribute.value) {
            key = attribute.value;
        } else if (element.hasAttribute("id")) {
            key = element.id;
        } else {
            throw new Error("[data-i18n-*] without value");
        }
        key = key.replace(/-./gu, (m) => m[1].toUpperCase());

        const value = browser.i18n.getMessage(PAGE + "_" + key + "_" + place);

        if ("textcontent" === place) {
            if (0 === element.children.length) {
                element.textContent = value;
            } else {
                for (const node of element.childNodes) {
                    if ("#text" === node.nodeName) {
                        node.nodeValue = node.nodeValue.replace("{}", value);
                    }
                }
            }
        } else {
            element.setAttribute(place, value);
        }
    }
}
