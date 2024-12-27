/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [harvests, setHarvests] = useState<any>({
    location: "",
    quantityInTons: 0,
    seed: "",
    fertilizer: "",
  });
  const [harvest, setHarvest] = useState<any>([]);

  useEffect(() => {
    takeHarvest();
  }, []);

  // Função para buscar as colheitas
  async function takeHarvest() {
    const resp = await fetch("http://localhost:3001/harvest");
    const data = await resp.json();
    setHarvest(data);
  }

  // Função para criar uma nova colheita
  async function harvestCreate() {
    if (
      !harvests.location ||
      !harvests.seed ||
      !harvests.fertilizer ||
      harvests.quantityInTons <= 0
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const response = await fetch("http://localhost:3001/harvest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: harvests.location,
        quantityInTons: harvests.quantityInTons,
        seed: harvests.seed,
        fertilizer: harvests.fertilizer,
      }),
    });

    if (!response.ok) {
      alert("Não foi possível criar a colheita.");
      return;
    }

    setHarvests({ location: "", quantityInTons: 0, seed: "", fertilizer: "" });
    await takeHarvest();
  }

  // Função para editar uma colheita existente
  async function harvestEdit() {
    if (!harvests.id) {
      alert("Colheita não encontrada.");
      return;
    }

    if (
      !harvests.location ||
      !harvests.seed ||
      !harvests.fertilizer ||
      harvests.quantityInTons <= 0
    ) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const response = await fetch(
      `http://localhost:3001/harvest/${harvests.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: harvests.location,
          quantityInTons: harvests.quantityInTons,
          seed: harvests.seed,
          fertilizer: harvests.fertilizer,
        }),
      }
    );

    if (!response.ok) {
      alert("Não foi possível realizar as alterações");
      return;
    }

    setHarvests({ location: "", quantityInTons: 0, seed: "", fertilizer: "" });
    await takeHarvest();
  }

  // Função para excluir uma colheita
  async function harvestDelete(id: number) {
    const response = await fetch(`http://localhost:3001/harvest/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Não foi possível excluir a colheita selecionada.");
      return;
    }

    await takeHarvest();
  }

  // Função para obter a colheita por ID
  async function takeHarvestId(id: number) {
    const response = await fetch(`http://localhost:3001/harvest/${id}`);
    const harvest = await response.json();
    setHarvests(harvest);
  }

  // Função para renderizar o formulário de colheita
  function harvestsForm() {
    return (
      <div className="container">
        <div id="form">
          <div>
            <label htmlFor="location">Localização:</label>
            <input
              id="location"
              type="text"
              value={harvests?.location ?? ""}
              onChange={(e) =>
                setHarvests({ ...harvests, location: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="quantityInTons">Quantidade (Toneladas):</label>
            <input
              id="quantityInTons"
              type="number"
              value={harvests?.quantityInTons || 0}
              onChange={(e) =>
                setHarvests({
                  ...harvests,
                  quantityInTons: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label htmlFor="seed">Tipo de semente:</label>
            <input
              id="seed"
              type="text"
              value={harvests?.seed ?? ""}
              onChange={(e) =>
                setHarvests({ ...harvests, seed: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="fertilizer">Fertilizante:</label>
            <input
              id="fertilizer"
              type="text"
              value={harvests?.fertilizer ?? ""}
              onChange={(e) =>
                setHarvests({ ...harvests, fertilizer: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          {!harvests?.id ? (
            <button onClick={harvestCreate}>Salvar</button>
          ) : (
            <button onClick={harvestEdit}>Editar Colheita</button>
          )}
        </div>
      </div>
    );
  }

  function renderHarvests() {
    return (
      <div className="container">
        {harvest.map((item: any) => (
          <div key={item.id}>
            <p>Data de Criação: {item.date}</p>
            <p>Local: {item.location}</p>
            <p>Quantidade em Toneladas: {item.quantityInTons}</p>
            <p>Semente: {item.seed}</p>
            <p>Fertilizante: {item.fertilizer}</p>
            <button onClick={() => takeHarvestId(item.id)}>Editar</button>
            <button onClick={() => harvestDelete(item.id)}>Excluir</button>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      {harvestsForm()}
      {renderHarvests()}
    </div>
  );
}
