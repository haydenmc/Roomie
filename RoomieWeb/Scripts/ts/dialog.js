var Dialog = (function () {
    function Dialog(t) {
        this.title = "";
        this.actions = new Array();
        if (t) {
            this.title = t;
        }
        this.page_element = document.createElement("div");
        this.page_element.classList.add("dialog");

        this.page_element.innerHTML = '<h1>' + this.title + '</h1>' + '<div class="separator"></div>' + '<div class="content"></div>' + '<ul class="actions"></ul>';
    }
    Dialog.prototype.addAction = function (text, action, def) {
        var a = new DialogAction();
        a.text = text;
        a.action = action;
        this.actions.push(a);

        var li = document.createElement("li");
        var b = document.createElement("button");
        if (def) {
            b.classList.add("default");
        }
        b.innerText = text;
        b.addEventListener("click", function (evt) {
            action();
        });
        li.appendChild(b);

        this.page_element.getElementsByClassName("actions")[0].appendChild(li);
    };

    Dialog.prototype.setContent = function (content) {
        var element = (this.page_element.getElementsByClassName("content")[0]);
        element.innerHTML = content;
    };

    Dialog.prototype.show = function () {
        this.overlay_element = document.createElement("div");
        this.overlay_element.classList.add("darkOverlay");
        this.overlay_element.classList.add("animation");
        this.overlay_element.classList.add("anim_fadein");
        this.overlay_element = (document.body.appendChild(this.overlay_element));

        this.page_element.classList.add("animation");
        this.page_element.classList.add("anim_shovein_bottom");
        this.page_element = (document.body.appendChild(this.page_element));
    };

    Dialog.prototype.hide = function () {
        var _this = this;
        this.overlay_element.classList.remove("anim_fadein");
        this.overlay_element.classList.add("anim_fadeout");

        this.page_element.classList.remove("anim_shovein_bottom");
        this.page_element.classList.add("anim_shoveout_bottom");

        // Unless overridden, any dialog has 300ms to clean everything up before it's removed from the DOM.
        setTimeout(function () {
            _this.page_element = (_this.page_element.parentElement.removeChild(_this.page_element));
            _this.overlay_element = (_this.overlay_element.parentElement.removeChild(_this.overlay_element));
        }, 300);
    };
    return Dialog;
})();

var DialogAction = (function () {
    function DialogAction() {
    }
    return DialogAction;
})();
//# sourceMappingURL=dialog.js.map
