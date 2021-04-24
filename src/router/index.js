import Vue from "vue";
import VueRouter from "vue-router";
import Editor from "../views/Editor.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/editor",
    name: "editor",
    component: Editor
  }
];

const router = new VueRouter({
  routes
});

export default router;
