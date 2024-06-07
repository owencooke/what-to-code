import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

async function runCommand(): Promise<{ message: string }> {
  const command = "npm create vite@latest my-vite-app -- --template react";
  console.log(`Running command: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command);
    console.log(`Command stdout: ${stdout}`);
    console.log(`Command stderr: ${stderr}`);

    if (stderr) {
      throw new Error(stderr);
    }

    return { message: stdout };
  } catch (error) {
    console.error(`Error running command: ${error}`);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request");
    const result = await runCommand();
    console.log("Command executed successfully", result);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("Error in POST handler", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
