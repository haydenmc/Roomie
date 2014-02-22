/**
* This class will apply an animation to the elements found by the 'selector'.
*/
var Animation = (function () {
    function Animation(s, anim) {
        this.selector = s;
        this.animation_name = anim;
    }
    Animation.prototype.apply = function (base_element) {
        var elements = $(base_element).find(this.selector);
        elements.addClass("animation");
        elements.addClass(this.animation_name);
    };

    Animation.prototype.clear = function (base_element) {
        var elements = $(base_element).find(this.selector);
        elements.removeClass("animation");
        elements.removeClass(this.animation_name);
    };
    return Animation;
})();
//# sourceMappingURL=animation.js.map
