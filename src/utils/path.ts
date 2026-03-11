import { page } from '$app/state';

export function getCurrentPath() {
    return page.url.pathname.substring(page.url.pathname.lastIndexOf('/') + 1)
}