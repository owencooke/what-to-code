import os from "os";

export function viteReactCommands(repoFullName: string): string[] {
  const commands = [
    `npm create vite@latest my-vite-app -- --template react`,
    `cd my-vite-app && git init`,
    `cd my-vite-app && git remote add origin https://github.com/${repoFullName}.git`,
    `cd my-vite-app && git add .`,
    `cd my-vite-app && git commit -m "Initial commit"`,
    `cd my-vite-app && git branch -M main`,
    `cd my-vite-app && git push -u origin main`,
    os.platform() === "win32" ? `rd /s /q my-vite-app` : `rm -rf my-vite-app`, // kinda sketchy, look at later
  ];
  return commands;
}

export function viteVueCommands(repoFullName: string): string[] {
  const commands = [
    `npm create vite@latest my-vite-app -- --template vue`,
    `cd my-vite-app && git init`,
    `cd my-vite-app && git remote add origin https://github.com/${repoFullName}.git`,
    `cd my-vite-app && git add .`,
    `cd my-vite-app && git commit -m "Initial commit"`,
    `cd my-vite-app && git branch -M main`,
    `cd my-vite-app && git push -u origin main`,
    os.platform() === "win32" ? `rd /s /q my-vite-app` : `rm -rf my-vite-app`, // kinda sketchy, look at later
  ];
  return commands;
}
