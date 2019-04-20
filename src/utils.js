import { publicUrlPathPrefix } from "./constants";

export function getPathForRouter (path, params = {}) {
    return `${ publicUrlPathPrefix }${ path.replace(/\:([^\/]+)/g, (_, paramName) => {
        return params[paramName] || "UNDEFINED_GOOSE";
    }) }`;
}