import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../HomePage.vue";
import SouvenirPage from "../SouvenirPage.vue";
import AlbumPage from "../AlbumPage.vue";
import FichePage from "../FichePage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/souvenir",
    name: "Souvenir",
    component: SouvenirPage,
  },
  {
    path: "/album",
    name: "Album",
    component: AlbumPage,
  },
  {
    path: "/fiche/:id",
    name: "FichePage",
    component: FichePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
