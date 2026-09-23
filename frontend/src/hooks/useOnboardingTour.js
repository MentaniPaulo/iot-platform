// src/hooks/useOnboardingTour.js
// Tour guiado de primeira visita: passos com alvo (data-tour="..."),
// título e descrição. Roda automaticamente uma vez (localStorage) e pode
// ser reaberto a qualquer momento pelo botão "?" no cabeçalho.

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ecosense_tour_seen';

export const TOUR_STEPS = [
  {
    target: '[data-tour="nav-dashboard"]',
    title: 'Bem-vindo à EcoSense 🌿',
    desc: 'Este é o Painel — o resumo ao vivo do conforto ambiental (ICAU-D) das cidades monitoradas. Vamos fazer um tour rápido, clique nos destaques ou use "Próximo".',
  },
  {
    target: '[data-tour="live-map"]',
    title: 'Mapa ao vivo',
    desc: 'Cada ponto é um sensor real. Clique num ponto do mapa pra ver os detalhes — cor e tamanho indicam a nota ICAU-D daquele sensor.',
  },
  {
    target: '[data-tour="period-filters"]',
    title: 'Ao vivo, 7 dias ou 30 dias',
    desc: 'Alterne entre os dados do momento e o histórico acumulado — experimente clicar em "Últimos 7 Dias".',
  },
  {
    target: '[data-tour="alerts-panel"]',
    title: 'Alertas',
    desc: 'Quando existe um pico de poluição ou um sensor com problema, ele aparece aqui. Clique pra expandir os detalhes.',
  },
  {
    target: '[data-tour="top10-ranking"]',
    title: 'Ranking das cidades',
    desc: 'As 10 cidades com melhor ICAU-D agora. Clique no nome de qualquer cidade pra abrir a página dela, com histórico e tendência.',
  },
  {
    target: '[data-tour="nav-howitworks"]',
    title: 'Quer entender a fórmula?',
    desc: 'Em "Como Funciona" explicamos o cálculo do ICAU-D, as fontes de dados e a arquitetura da plataforma em detalhe.',
  },
  {
    target: '[data-tour="a11y-menu"]',
    title: 'Acessibilidade',
    desc: 'Alto contraste, tamanho de fonte, reduzir animações e um narrador que lê a página em voz alta — tudo aqui.',
  },
];

export function useOnboardingTour() {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = tour fechado
  const isActive = stepIndex >= 0;

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // pequeno atraso pra garantir que o conteúdo da página já montou
      const timer = setTimeout(() => setStepIndex(0), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const start = useCallback(() => setStepIndex(0), []);

  const finish = useCallback(() => {
    setStepIndex(-1);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const next = useCallback(() => {
    setStepIndex(i => {
      if (i + 1 >= TOUR_STEPS.length) {
        localStorage.setItem(STORAGE_KEY, 'true');
        return -1;
      }
      return i + 1;
    });
  }, []);

  const prev = useCallback(() => {
    setStepIndex(i => Math.max(0, i - 1));
  }, []);

  return { isActive, stepIndex, step: TOUR_STEPS[stepIndex], total: TOUR_STEPS.length, start, next, prev, finish };
}
