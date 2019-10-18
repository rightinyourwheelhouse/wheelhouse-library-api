import {toDataURL} from "qrcode";

export function qrify(id: string): Promise<string> {
    return toDataURL(id);
}
