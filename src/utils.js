import { publicUrlPathPrefix } from "./constants";

export function getPathForRouter (path) {
    return `${ publicUrlPathPrefix }${ path }`;
}