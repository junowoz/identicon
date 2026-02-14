"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import blockies from "ethereum-blockies";

const GRID_SIZE = 8;
const MAX_INPUT_LENGTH = 100;
const PREVIEW_SIZE = 256;
const DOWNLOAD_SIZE = 1024;

const hashText = (text: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const colorFromSeed = (seed: string, offset: number): string => {
  const hash = hashText(`${seed}:${offset}`);
  const hue = hash % 360;
  const saturation = 45 + ((hash >>> 8) % 40);
  const lightness = 35 + ((hash >>> 16) % 35);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const sanitizeFilename = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return "identicon";

  const safe = trimmed
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, " ")
    .slice(0, MAX_INPUT_LENGTH);

  return safe || "identicon";
};

const createIdenticonDataUrl = (seed: string, imageSize: number): string => {
  const scale = Math.max(1, Math.floor(imageSize / GRID_SIZE));
  const icon = blockies.create({
    seed,
    size: GRID_SIZE,
    scale,
    color: colorFromSeed(seed, 1),
    bgcolor: colorFromSeed(seed, 2),
    spotcolor: colorFromSeed(seed, 3),
  } as unknown as Parameters<typeof blockies.create>[0]);
  return icon.toDataURL();
};

export default function IdenticonGenerator() {
  const [input, setInput] = useState<string>("");
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (input.length === 0) {
      setDataUrl("");
      return;
    }
    setDataUrl(createIdenticonDataUrl(input, PREVIEW_SIZE));
  }, [input]);

  const downloadImage = () => {
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = createIdenticonDataUrl(input, DOWNLOAD_SIZE);
    link.download = `${sanitizeFilename(input)}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center text-black">
      <div className="bg-white m-4 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">🎨 Gerador de Identicons</h1>
        <p className="mb-4 text-sm text-gray-600">
          Um identicon é uma imagem que representa visualmente uma identidade
          única. Você pode, por exemplo, criar imagens de perfil personalizadas.
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= MAX_INPUT_LENGTH)
              setInput(e.target.value);
          }}
          placeholder="Digite aqui para começar"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
        />
        {dataUrl ? (
          <div className="mt-4 flex flex-col items-center">
            <Image
              src={dataUrl}
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE}
              alt="Identicon"
              className="rounded-lg"
            />
            <button
              onClick={downloadImage}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg transition-transform transform hover:scale-105"
            >
              Baixar Imagem
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center">
            <Image
              src="/placeholder.png"
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE}
              alt="Placeholder"
            />
            <button
              disabled
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              Baixar Imagem
            </button>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-600">
          Pré-visualização: {PREVIEW_SIZE}x{PREVIEW_SIZE}px · Download:{" "}
          {DOWNLOAD_SIZE}x{DOWNLOAD_SIZE}px
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Entrada máxima: 100 caracteres.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Criado por{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://junowoz.com"
            className="text-blue-500 hover:underline"
          >
            @junowoz
          </a>
        </p>
      </div>
    </div>
  );
}
