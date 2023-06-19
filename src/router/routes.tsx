import { createBrowserRouter } from "react-router-dom";
import Root from "../ui/components/root";
import { PageForm } from "../ui/components/pages/page-form.tsx";
import { Page404 } from "../ui/components/pages/page-404.tsx";
import { ClockAnimation } from "../ui/components/pages/page-animation";
import PageBox3D from "../ui/components/pages/page-3d-dice";
import Home from "../ui/components/pages/home.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      errorElement: <Page404 />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/dice",
          element: <PageBox3D />,
        },
        {
          path: "/clock",
          element: <ClockAnimation />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.DEV ? "/" : "/react-showcase/",
  }
);
