"use client";

import { useEffect, useRef } from "react";

interface ShaderBackgroundProps {
  className?: string;
  dim?: number; // 0 to 1 to dim the shader background for better readability
}

export default function ShaderBackground({ className = "", dim = 0.35 }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Synchronize sizes
    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    // Set up ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", syncSize);
    }
    syncSize();

    // Get WebGL Context
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source (Organic moving wave matching design theme)
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        float time = u_time * 0.15;
        
        // Normalize mouse coordinates (0 to 1)
        vec2 m = u_mouse / u_resolution;
        if (length(u_mouse) == 0.0) {
          m = vec2(0.5);
        }

        // Create interactive organic movement using sine waves and mouse coordinates
        float noise = sin(uv.x * 6.0 + time + m.x * 2.0) * sin(uv.y * 6.0 - time + m.y * 2.0);
        noise += sin(uv.x * 3.0 - time * 1.2 + m.y * 3.0) * cos(uv.y * 5.0 + time * 0.7 + m.x * 3.0);
        noise += sin(length(uv - m) * 4.0 - time * 2.0) * 0.3; // Mouse ripple wave
        
        // Design system custom colors
        vec3 color1 = vec3(0.231, 0.510, 0.965); // Electric Blue (#3b82f6)
        vec3 color2 = vec3(0.545, 0.361, 0.965); // Vivid Purple (#8b5cf6)
        vec3 color3 = vec3(0.027, 0.035, 0.055); // Rich deep background (near surface-dark)
        vec3 color4 = vec3(0.024, 0.773, 0.463); // Touch of Success Emerald (#22c55e)
        
        // Blend colors based on noise and positions
        vec3 finalColor = mix(color3, color1, smoothstep(-1.2, 1.2, noise + uv.y));
        finalColor = mix(finalColor, color2, smoothstep(0.4, 1.6, noise + uv.x));
        
        // Splash a bit of emerald near the mouse
        float mouseDist = length(uv - m);
        float emeraldGlow = smoothstep(0.3, 0.0, mouseDist);
        finalColor = mix(finalColor, color4, emeraldGlow * 0.12);
        
        // Add a subtle vignette to darken borders
        float vignette = 1.0 - length(uv - 0.5) * 0.75;
        finalColor *= max(vignette, 0.0);

        // Render slightly dimmed for readability
        gl_FragColor = vec4(finalColor * ${dim.toFixed(2)}, 1.0);
      }
    `;

    // Helper to compile shaders
    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    // Link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Buffer setup
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    // Track mouse input
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = rect.height - (e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initial mouse center position
    setTimeout(() => {
      if (canvas) {
        targetMouse.x = canvas.width / 2;
        targetMouse.y = canvas.height / 2;
        mouse.x = targetMouse.x;
        mouse.y = targetMouse.y;
      }
    }, 100);

    // Render loop
    let animationId: number;
    function render(t: number) {
      if (!gl || !canvas) return;
      
      // Smooth mouse interpolation
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", syncSize);
      }
      if (gl) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [dim]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -2,
        pointerEvents: "none",
      }}
    />
  );
}
