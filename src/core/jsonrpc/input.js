/**
 * @module
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Input</em> de Kodi.
 *
 * @see {@link https://kodi.wiki/view/JSON-RPC_API}
 */
export const Input = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Input</em>.
     *
     * @param {object}   kodi      Le client pour contacter Kodi.
     * @param {Function} kodi.send La méthode pour envoyer une requête.
     */
    constructor(kodi) {
        this.kodi = kodi;
    }

    /**
     * Retourne en arrière dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    back() {
        return this.kodi.send("Input.Back");
    }

    /**
     * Affiche le menu contextuel.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    contextMenu() {
        return this.kodi.send("Input.ContextMenu");
    }

    /**
     * Navigue vers le bas dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    down() {
        return this.kodi.send("Input.Down");
    }

    /**
     * Affiche la page d'accueil de Kodi.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    home() {
        return this.kodi.send("Input.Home");
    }

    /**
     * Affiche les informations.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    info() {
        return this.kodi.send("Input.Info");
    }

    /**
     * Navigue vers la gauche dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    left() {
        return this.kodi.send("Input.Left");
    }

    /**
     * Navigue vers la droite dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    right() {
        return this.kodi.send("Input.Right");
    }

    /**
     * Sélectionne l'élément courant.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    select() {
        return this.kodi.send("Input.Select");
    }

    /**
     * Affiche le <em>menu à l'écran</em> (<em>On Screen Display</em>) du
     * lecteur courant.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    showOSD() {
        return this.kodi.send("Input.ShowOSD");
    }

    /**
     * Navigue vers le haut dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    up() {
        return this.kodi.send("Input.Up");
    }
};
