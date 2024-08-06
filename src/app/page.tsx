"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import blockies from "ethereum-blockies";

export default function IdenticonGenerator() {
  const [input, setInput] = useState<string>("");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [imageSize] = useState<number>(256);

  useEffect(() => {
    if (input) {
      generateIdenticon(input);
    } else {
      setDataUrl("");
    }
  }, [input]);

  const generateIdenticon = (input: string) => {
    const icon = blockies.create({
      seed: input.toLowerCase(),
      size: 8,
      scale: 64,
    });
    setDataUrl(icon.toDataURL());
  };

  const downloadImage = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${input}.png`;
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
            if (e.target.value.length <= 500) setInput(e.target.value);
          }}
          placeholder="Digite aqui para começar"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
        />
        {dataUrl ? (
          <div className="mt-4 flex flex-col items-center">
            <Image
              src={dataUrl}
              width={imageSize}
              height={imageSize}
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
              width={imageSize}
              height={imageSize}
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
          Tamanho da imagem: {imageSize}x{imageSize}px
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Criado por{" "}
          <a
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
