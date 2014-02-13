var Register = (function () {
    function Register() {
        this.name = "Register";
        this.page_element = document.createElement("div");
        this.page_element.classList.add("page");
        this.page_element.innerHTML = '<h1 class="title">register</h1>';
    }
    Register.prototype.show = function () {
        this.page_element = (document.getElementsByTagName("body")[0].insertBefore(this.page_element));
    };

    Register.prototype.hide = function () {
        this.page_element = (this.page_element.parentNode.removeChild(this.page_element));
    };

    Register.prototype.destroy = function () {
    };
    return Register;
})();
//# sourceMappingURL=register.js.map
