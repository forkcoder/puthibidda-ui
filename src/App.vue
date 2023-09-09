<template>
  <super-container
    :uxmenu="uxmenu"
    :containers="uxmeta.containers"
    :panels="uxmeta.panels"
    :cards="uxmeta.cards"
    v-on:huntbooks="loadUXmeta"
    v-on:homepage="loadUXmeta"
    v-on:showdetail="loadUXmeta"
    v-on:updatelang="loadUXmenu"
    v-on:addtocart="addToCart"
    v-on:loaddetailfunction="loadDTLfnct"
  ></super-container>
</template>

<script>
export default {
  name: "App",
  // props: ["appdata", "categorypage"],
  props: ["books", "categories", "appjs"],
  data() {
    return {
      uxmeta: [],
      uxmenu: [],
      handle: "homepage",
      categorypage: -1,
    };
  },
  beforeCreate() {
    this.$http
      .get("/getuxmeta/homepage")
      .then((response) => (this.uxmeta = response.data));
    this.$http
      .get("/getuxmenu/en_title")
      .then((response) => (this.uxmenu = response.data));
    window.onpopstate = function (event) {
      console.log(
        "location: " +
          document.location +
          ", state: " +
          JSON.stringify(event.state)
      );
    };
  },
  methods: {
    loadDTLfnct() {
      this.this.$(".product").each(function (i, el) {
        // Lift card and show stats on Mouseover
        this.$(el)
          .find(".make3D")
          .hover(
            function () {
              this.$(this).parent().css("z-index", "20");
              this.$(this).addClass("animate");
              this.$(this)
                .find("div.carouselNext, div.carouselPrev")
                .addClass("visible");
            },
            function () {
              this.$(this).removeClass("animate");
              this.$(this).parent().css("z-index", "1");
              this.$(this)
                .find("div.carouselNext, div.carouselPrev")
                .removeClass("visible");
            }
          );

        // Flip card to the back side
        this.$(el)
          .find(".view_gallery")
          .click(function () {
            this.$(el)
              .find("div.carouselNext, div.carouselPrev")
              .removeClass("visible");
            this.$(el).find(".make3D").addClass("flip-10");
            setTimeout(function () {
              this.$(el)
                .find(".make3D")
                .removeClass("flip-10")
                .addClass("flip90")
                .find("div.shadow")
                .show()
                .fadeTo(80, 1, function () {
                  this.$(el)
                    .find(".product-front, .product-front div.shadow")
                    .hide();
                });
            }, 50);

            setTimeout(function () {
              this.$(el)
                .find(".make3D")
                .removeClass("flip90")
                .addClass("flip190");
              this.$(el)
                .find(".product-back")
                .show()
                .find("div.shadow")
                .show()
                .fadeTo(90, 0);
              setTimeout(function () {
                this.$(el)
                  .find(".make3D")
                  .removeClass("flip190")
                  .addClass("flip180")
                  .find("div.shadow")
                  .hide();
                setTimeout(function () {
                  this.$(el)
                    .find(".make3D")
                    .css("transition", "100ms ease-out");
                  this.$(el).find(".cx, .cy").addClass("s1");
                  setTimeout(function () {
                    this.$(el).find(".cx, .cy").addClass("s2");
                  }, 100);
                  setTimeout(function () {
                    this.$(el).find(".cx, .cy").addClass("s3");
                  }, 200);
                  this.$(el)
                    .find("div.carouselNext, div.carouselPrev")
                    .addClass("visible");
                }, 100);
              }, 100);
            }, 150);
          });

        // Flip card back to the front side
        this.$(el)
          .find(".flip-back")
          .click(function () {
            this.$(el)
              .find(".make3D")
              .removeClass("flip180")
              .addClass("flip190");
            setTimeout(function () {
              this.$(el)
                .find(".make3D")
                .removeClass("flip190")
                .addClass("flip90");

              this.$(el)
                .find(".product-back div.shadow")
                .css("opacity", 0)
                .fadeTo(100, 1, function () {
                  this.$(el)
                    .find(".product-back, .product-back div.shadow")
                    .hide();
                  this.$(el)
                    .find(".product-front, .product-front div.shadow")
                    .show();
                });
            }, 50);

            setTimeout(function () {
              this.$(el)
                .find(".make3D")
                .removeClass("flip90")
                .addClass("flip-10");
              this.$(el)
                .find(".product-front div.shadow")
                .show()
                .fadeTo(100, 0);
              setTimeout(function () {
                this.$(el).find(".product-front div.shadow").hide();
                this.$(el)
                  .find(".make3D")
                  .removeClass("flip-10")
                  .css("transition", "100ms ease-out");
                this.$(el).find(".cx, .cy").removeClass("s1 s2 s3");
              }, 100);
            }, 150);
          });

        makeCarousel(el);
      });

      /* ----  Image Gallery Carousel   ---- */
      function makeCarousel(el) {
        var carousel = this.$(el).find(".carousel ul");
        var carouselSlideWidth = 315;
        var carouselWidth = 0;
        var isAnimating = false;
        var currSlide = 0;
        this.$(carousel).attr("rel", currSlide);

        // building the width of the casousel
        this.$(carousel)
          .find("li")
          .each(function () {
            carouselWidth += carouselSlideWidth;
          });
        this.$(carousel).css("width", carouselWidth);

        // Load Next Image
        this.$(el)
          .find("div.carouselNext")
          .on("click", function () {
            var currentLeft = Math.abs(parseInt(this.$(carousel).css("left")));
            var newLeft = currentLeft + carouselSlideWidth;
            if (newLeft == carouselWidth || isAnimating === true) {
              return;
            }
            this.$(carousel).css({
              left: "-" + newLeft + "px",
              transition: "300ms ease-out",
            });
            isAnimating = true;
            currSlide++;
            this.$(carousel).attr("rel", currSlide);
            setTimeout(function () {
              isAnimating = false;
            }, 300);
          });
        this.$(el)
          .find("div.carouselPrev")
          .on("click", function () {
            var currentLeft = Math.abs(parseInt(this.$(carousel).css("left")));
            var newLeft = currentLeft - carouselSlideWidth;
            if (newLeft < 0 || isAnimating === true) {
              return;
            }
            this.$(carousel).css({
              left: "-" + newLeft + "px",
              transition: "300ms ease-out",
            });
            isAnimating = true;
            currSlide--;
            this.$(carousel).attr("rel", currSlide);
            setTimeout(function () {
              isAnimating = false;
            }, 300);
          });
      }
    },
    loadUXmeta(handle) {
      this.$http
        .get("/getuxmeta/" + handle)
        .then((response) => (this.uxmeta = response.data));
    },
    loadUXmenu(lang) {
      this.$http
        .get("/getuxmenu/" + lang)
        .then((response) => (this.uxmenu = response.data));
    },
    addToCart(event) {
      // addToCart(event);
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/scss/appDesktop.scss";
</style>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
