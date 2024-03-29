<template>
  <ul class="categorycard">
    <li class="categorycardTitle" :style="cssVars">
      <img
        style="width: 30px; height: 30px; border-radius: 50%"
        :src="logo"
        :alt="title"
        compresswidth="80"
        compressheight="80"
        compressquality="70"
      />
      <a style="padding: 0 10px"> {{ title }} </a>
    </li>
    <li v-if="!loading" :id="prefix + id">
      <div v-for="n in totalPage" :key="n">
        <div class="normalizeElement">
          <div
            v-for="(book, index) in books.slice(
              (n - 1) * booksPerPage,
              n * booksPerPage
            )"
            :key="
              prefix +
              '-' +
              (n - 1) * booksPerPage +
              '-' +
              index +
              '-' +
              book.id
            "
            :ref="
              prefix +
              '-' +
              (n - 1) * booksPerPage +
              '-' +
              index +
              '-' +
              book.id
            "
            :id="
              prefix +
              '-' +
              (n - 1) * booksPerPage +
              '-' +
              index +
              '-' +
              book.id
            "
            class="book card"
          >
            <img
              class="book-image card-img-top"
              @click="itemClicked(book)"
              :key="book.book_id"
              :id="
                prefix +
                '-' +
                (n - 1) * booksPerPage +
                '-' +
                index +
                '-' +
                book.id +
                'cover'
              "
              :class="{ selected: isSelected(prefix + '-' + book.id) }"
              :src="require('@/assets/bookcovers/' + book.book_id + '.jpg')"
            />

            <div
              :id="
                prefix +
                '-' +
                (n - 1) * booksPerPage +
                '-' +
                index +
                '-' +
                book.id +
                'footer'
              "
              class="book-footer"
            >
              <a
                class="cd-add-to-cart js-cd-add-to-cart"
                v-on:click="cartEventListener($event)"
                :data-price="book.book_price"
                :data-title="book.book_title"
                :data-cover="'/bookcovers/' + book.book_id + '.jpg'"
                >{{ "BDT " + book.book_price }}</a
              >
            </div>
            <span v-if="book.id % 2 == 1" class="special-badge">
              {{ book.book_offer_rate + "%" }}
            </span>
          </div>
        </div>
      </div>
    </li>
    <li v-if="loading">
      <loader-card></loader-card>
    </li>
  </ul>
</template>
<script>
import LoaderCard from "../cards/LoaderCard.vue";
export default {
  name: "MobilePreviewCard",
  props: ["title", "prefix", "id", "titleColor", "logo"],
  data: function () {
    return {
      loading: false,
      datalink: "",
      books: [],
      loadedBooks: [],
      totalBooks: 0,
      bookShelfWidth: 0,
      perBookWidth: 113,
      totalPage: 0,
      booksPerPage: 0,
      selectedBook: -1,
      windowWidth: 0,
      windowHeight: 0,
    };
  },
  components: {
    "loader-card": LoaderCard,
  },
  computed: {
    cssVars() {
      return {
        "--title-color": this.titleColor,
      };
    },
  },
  created() {
    window.addEventListener("resize", this.getWindowWidth);
    window.addEventListener("resize", this.getWindowHeight);
  },
  unmounted() {
    window.removeEventListener("resize", this.getWindowWidth);
    window.removeEventListener("resize", this.getWindowHeight);
  },
  mounted() {
    if (this.id == 0) this.datalink = "/books/allbooks";
    else this.datalink = "/books/category/" + this.id;
    this.loadData();
  },
  methods: {
    cartEventListener: function (event) {
      this.$emit("addtocart", event);
    },
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
      this.renderData();
    },
    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    },
    itemClicked: function (bookdetail) {
      this.$emit("bookdetail", bookdetail);
    },
    renderData: function () {
      this.windowWidth = document.documentElement.clientWidth;
      this.bookShelfWidth = this.windowWidth;
      this.totalPage = Math.ceil(
        (this.totalBooks * this.perBookWidth) / this.bookShelfWidth
      );
      this.booksPerPage = Math.floor(this.bookShelfWidth / this.perBookWidth);
      //padding selves
      this.books = [];
      this.books = this.loadedBooks;
      // console.log(this.totalPage*this.booksPerPage-this.totalBooks);
      let padding = this.totalPage * this.booksPerPage - this.totalBooks;
      if (padding > 0 && padding <= this.totalBooks) {
        this.books = this.books.concat(this.loadedBooks.slice(0, padding));
      }
    },
    loadData: function () {
      this.loading = true;
      this.$http
        .get(this.datalink)
        .then((response) => {
          this.loading = false;
          this.loadedBooks = response.data;
          this.totalBooks = this.loadedBooks.length;
          this.renderData();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    calculateBookDirection(bookIndex, selectedIndex) {
      if (selectedIndex === -1) {
        return 0;
      }
      const diff = bookIndex - selectedIndex;
      return diff === 0 ? 0 : diff / Math.abs(diff);
    },
    isSelected(bookIndex) {
      return this.selectedBook === bookIndex;
    },
  },
};
</script>

<style scoped>
.categorycard {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  height: auto;
  list-style: none;
  align-self: stretch;
  padding: 0 5px;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  background: var(--cd-color-bg);
  background-color: var(--cd-color-bg);
  box-shadow: var(--cd-shadow-common);
  -webkit-box-shadow: var(--cd-shadow-common);
  -moz-box-shadow: var(--cd-shadow-common);
}
.categorycardTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  overflow: visible;
  font-size: 15px;
  border-bottom: 1px solid lightgray;
  color: var(--title-color);
}
.special-badge {
  position: absolute;
  left: -5px;
  top: -10px;
  align-self: center;
  background: #ff4444;
  /* #f2d900; */
  text-align: center;
  border-radius: 10px;
  color: #ffffff;
  padding: 0px 10px;
  font-size: 14px;
}

.cd-add-to-cart {
  white-space: nowrap;
  padding: var(--space-xs) var(--space-xs);
  border-radius: 50em;
  font-weight: 700;
  letter-spacing: 0.1em;
  /* height: 25px; */
  width: 25px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("@/assets/images/mobile/addtocart.png");
  text-indent: 25px;
  color: white;
  text-shadow: 2px 2px 10px #000000;
  font-size: var(--text-xs);
}

.normalizeElement {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 5px;
  justify-content: space-around;
  background: var(--cd-color-bg);
}

a.carousel-control-prev,
a.carousel-control-next {
  background: #aaaaaa;
  margin: auto 0;
  width: 25px;
  height: 60px;
}
.carousel-control-next-icon,
.carousel-control-prev-icon {
  background-size: 100% 100%;
  height: 20px !important;
  width: 20px !important;
}
.book {
  display: flex;
  position: relative;
  background-color: #ffffff;
  height: 150px;
  width: 98px;
  margin: 5px;
  /* overflow: hidden; */
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
/*
.book:before {
content: "";
position: absolute;
top: 0%;
left: 0%;
width: 0px;
height: 0px;
border-bottom: 40px solid #eee;
border-left: 40px solid transparent;
-webkit-box-shadow: -7px -7px 7px rgba(0,0,0,0.3);
-moz-box-shadow: -7px -7px 7px rgba(0,0,0,0.3);
box-shadow: -7px -7px 7px rgba(0,0,0,0.3);
}

.book:after {
content: "";
position: absolute;
top: 0%;
left: 0%;
width: 0px;
height: 0px;
border-top: 41px solid rgba(255, 191, 31, 1);
border-right: 41px solid transparent;
}
*/
.book-image {
  position: absolute;
  left: -10px;
  right: -10px;
  margin: auto;
  min-width: 100%;
}

.book-footer {
  position: absolute;
  bottom: 0;
  align-self: flex-start;
  padding: 0 2px;
}

.offerdiv {
  position: absolute;
  bottom: 0px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: auto;
  background: lightgray;
  border-radius: 50%;
  text-align: center;
  width: 30px;
  height: 30px;
  padding: 15px 0 0 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
  font-size: 16px;
}
</style>
