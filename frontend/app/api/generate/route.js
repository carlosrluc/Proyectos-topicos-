import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req) {
  const body = await req.json();
  const moduleName = body.name;

  const backendPath = path.join(process.cwd(), "..");

  return new Promise(resolve => {
    exec(
      `node src/generator.js ${moduleName}`,
      { cwd: backendPath },
      (err, stdout, stderr) => {
        if (err) {
          resolve(NextResponse.json({ error: stderr }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ output: stdout }));
        }
      }
    );
  });
}
