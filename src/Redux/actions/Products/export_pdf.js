
import { api } from "../../api"; 

export const exportCatalogPDF = (userId, options = {}) => async () => {

  try {
    const response = await api({
      method: "post",
      url: `/products/export-pdf`,
      data: options,        // body en GET
      responseType: "blob", // para recibir PDF
      transformRequest: [(data, headers) => {
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
      }]
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "catalogo.pdf";
    link.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error al descargar PDF:", error);
  }
};
