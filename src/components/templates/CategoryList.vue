<template>
  <div class="category-grid">
    <div
      v-for="(category, index) in categories"
      :key="index"
      :ref="'category_' + index"
      :class="{ highlighted: index === hoveredIndex }"
      @mouseenter="setHoveredIndex(index)"
      @mouseleave="setHoveredIndex(-1)"
      class="category"
    >
      <img
        class="category-image"
        :class="{ selected: isSelected(index) }"
        :src="category.image"
      />
    </div>
  </div>
</template>
<style scoped>
.highlighted {
  position: "relative";
  height: "110%";
  opacity: "0.3";
}
</style>
<script>
export default {
  name: "CategoryList",
  props: ["categories"],
  data: function () {
    return {
      hoveredIndex: -1,
    };
  },
  methods: {
    setHoveredIndex(index) {
      this.hoveredIndex = index;
    },
    animateCategories() {
      this.categories.forEach((category, index) => {
        const direction = this.calculateCategoryDirection(
          index,
          this.selectedCategory
        );
        // TweenMax.to(this.$refs[`category_${index}`], 0.9, {
        //   x: direction * 50,
        // });
      });
    },
    calculateCategoryDirection(categoryIndex, selectedIndex) {
      if (selectedIndex === -1) {
        return 0;
      }
      const diff = categoryIndex - selectedIndex;
      return diff === 0 ? 0 : diff / Math.abs(diff);
    },

    isSelected(categoryIndex) {
      return this.selectedCategory === categoryIndex;
    },
  },
};
</script>
