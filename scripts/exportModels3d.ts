import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFile } from "node:fs/promises";
import { BUILDERS } from "../src/lib/models3d/catalog.js";

// GLTFExporter's writer uses FileReader even in binary mode; polyfill for Node.
if (typeof globalThis.FileReader === "undefined") {
  (globalThis as any).FileReader = class {
    readAsArrayBuffer(blob: any) {
      Promise.resolve(blob.arrayBuffer()).then((buf: any) => {
        (this as any).result = buf;
        (this as any).onloadend?.({ target: this });
        (this as any).onload?.({ target: this });
      });
    }
  };
}

const CYAN = "#1ABCD8";

function addLights(root: THREE.Group) {
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(4, 6, 5);
  key.name = "KeyLight";
  const fill = new THREE.DirectionalLight(new THREE.Color(CYAN), 0.5);
  fill.position.set(-5, 2, -4);
  fill.name = "FillLight";
  // Note: AmbientLight isn't supported by glTF; ambient comes from env in viewers.
  root.add(key, fill);
}

function exportOne(key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const build = (BUILDERS as Record<string, () => THREE.Group>)[key];
    const root = new THREE.Group();
    root.name = key;
    const model = build();
    root.add(model);
    addLights(root);

    const exporter = new GLTFExporter();
    exporter.parse(
      root,
      (result) => {
        const buf = Buffer.from(result as ArrayBuffer);
        const out = `public/glb/${key}.glb`;
        writeFile(out, buf)
          .then(() => resolve(`${key}: ${(buf.length / 1024).toFixed(1)} KB`))
          .catch(reject);
      },
      (err) => reject(err),
      { binary: true },
    );
  });
}

async function main() {
  const { mkdir } = await import("node:fs/promises");
  await mkdir("public/glb", { recursive: true });
  const keys = Object.keys(BUILDERS);
  for (const key of keys) {
    try {
      console.log("✓ " + (await exportOne(key)));
    } catch (e: any) {
      console.error("✗ " + key + ": " + e.message);
    }
  }
}

main();
