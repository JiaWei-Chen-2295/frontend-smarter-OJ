import {createBrowserRouter} from "react-router";
import OJIndex from "../pages/index";
import OJQuestion from "../pages/OJQuestion";
import Questions from "../pages/index/Questions";
import OJMain from "../pages/index/Main";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <OJIndex />,
        children: [
            {
                path: "/",
                element: <OJMain />,
            },
            {
                path: "/qs",
                element: <Questions />,
            }
        ]
    },
    {
        path: "/oj",
        element: <OJQuestion />,
    }
]);
