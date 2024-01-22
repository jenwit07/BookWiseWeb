export const allRoutes = (t) => [];

export default allRoutes;

export function getAllRoutes(t) {
  let routes = [];
  const findRoutes = (menu) => {
    for (let item of menu) {
      if (item.path && item.component) {
        routes.push({
          path: item.path,
          component: item.component,
          label: item.label,
        });
      }
      if (item.items) {
        findRoutes(item.items);
      }
    }
  };
  findRoutes(allRoutes(t));
  return routes;
}
