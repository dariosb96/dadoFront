import { createSelector } from "reselect";

// Trae todos los catálogos del state
const selectCatalogs = (state) => state.catalog.catalogs;

// Selector que devuelve categorías únicas y sus productos
export const selectCatalogsWithCategories = createSelector(
  [selectCatalogs],
  (catalogs) => {
    return catalogs.map((catalog) => {
      // Agrupamos productos por categoría
      const groupedByCategory = catalog.Products.reduce((acc, product) => {
        const categoryName = product.Category?.name || "Sin categoría";

        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }

        acc[categoryName].push(product);

        return acc;
      }, {});

      // Transformamos a un array [{ category, products }]
      const categories = Object.keys(groupedByCategory).map((category) => ({
        category,
        products: groupedByCategory[category],
      }));

      return {
  id: catalog.id, 
  businessName: catalog.businessName,
  categories,
};

    });
  }
);
