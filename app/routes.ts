import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/Auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/create-resume', 'routes/create-resume.tsx'),
    route('/my-resumes', 'routes/my-resumes.tsx'),
    route('/about', 'routes/about.tsx'),
    route('/pricing', 'routes/pricing.tsx'),
    // the id is used here to specify a unique resume
    route('/resume/:id', 'routes/Resume.tsx')
] satisfies RouteConfig;


