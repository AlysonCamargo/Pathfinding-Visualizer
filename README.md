# 🗺️ Pathfinding Visualizer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![HTML5](https://img.shields.io/badge/html-5-orange.svg)
![CSS3](https://img.shields.io/badge/css-3-blue.svg)

Visualizador interativo de algoritmos de busca de caminho (pathfinding) com animações em tempo real e interface intuitiva.

![Pathfinding Demo](https://via.placeholder.com/800x400?text=Pathfinding+Visualizer+Demo)

## ✨ Funcionalidades

- 🧭 **5 Algoritmos Clássicos**: Dijkstra, A*, BFS, DFS e Greedy Best-First Search
- 🎨 **Animações Suaves**: Visualize cada passo do algoritmo em tempo real
- 🎯 **Interface Interativa**: Arraste para criar paredes e mover nós inicial/final
- 🧱 **Gerador de Labirinto**: Crie obstáculos aleatórios instantaneamente
- ⚡ **Controle de Velocidade**: Ajuste a velocidade da animação
- 📊 **Estatísticas em Tempo Real**: Veja nós visitados, comprimento do caminho e tempo de execução
- 📱 **Design Responsivo**: Funciona perfeitamente em todos os dispositivos
- 🎛️ **Tamanhos de Grade Personalizáveis**: Pequena, média e grande

## 🚀 Demo

[Ver Demo ao Vivo]()

## 🎮 Como Usar

1. **Clone o repositório**:
git clone https://github.com/seu-usuario/pathfinding-visualizer.git
cd pathfinding-visualizer


2. **Abra o `index.html`** no seu navegador

3. **Interaja com o visualizador**:
   - Clique e arraste para criar paredes
   - Arraste os nós verde (início) e vermelho (fim) para reposicioná-los
   - Escolha um algoritmo e clique em "Visualizar"
   - Use "Gerar Labirinto" para criar obstáculos aleatórios

## 📚 Algoritmos Implementados

| Algoritmo | Complexidade | Garante Caminho Mais Curto? | Descrição |
|-----------|-------------|------------------------------|-----------|
| **Dijkstra** | O((V+E) log V) | ✅ Sim | Algoritmo clássico que explora todos os caminhos |
| **A*** | O(b^d) | ✅ Sim (com heurística admissível) | Usa heurística para explorar caminhos promissores |
| **BFS** | O(V+E) | ✅ Sim (grafos não ponderados) | Explora camada por camada |
| **DFS** | O(V+E) | ❌ Não | Explora profundidade máxima antes de retroceder |
| **Greedy Best-First** | O(b^d) | ❌ Não | Segue sempre o caminho mais próximo do objetivo |

### Detalhes dos Algoritmos

#### Dijkstra
Explora sistematicamente todos os caminhos, sempre escolhendo o nó com menor distância acumulada. Garante o caminho mais curto em grafos ponderados.

#### A* (A-Star)
Combina a distância percorrida com uma heurística (distância Manhattan) para estimar a distância até o destino. Mais eficiente que Dijkstra mantendo a garantia do caminho mais curto.

#### Breadth-First Search (BFS)
Explora todos os vizinhos de um nó antes de avançar para o próximo nível. Ideal para grafos não ponderados.

#### Depth-First Search (DFS)
Explora o máximo possível em uma direção antes de retroceder. Não é otimizado para encontrar caminhos mais curtos.

#### Greedy Best-First Search
Usa apenas a heurística para decidir o próximo nó. Rápido, mas pode não encontrar o caminho ótimo.

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Animações, gradientes e design responsivo
- **JavaScript (ES6+)**: 
  - Classes e programação orientada a objetos
  - Async/await para animações
  - Algoritmos de grafos
  - Manipulação avançada do DOM

## 🎯 Conceitos Demonstrados

Este projeto demonstra conhecimento em:
- ✅ Algoritmos de grafos e estruturas de dados
- ✅ Inteligência Artificial (heurísticas)
- ✅ Programação assíncrona
- ✅ Manipulação do DOM
- ✅ Design responsivo e UX
- ✅ Animações CSS avançadas
- ✅ Código limpo e organizado

## 🌟 Características Técnicas

- **Performance Otimizada**: Animações suaves mesmo com grades grandes
- **Código Modular**: Funções separadas para cada algoritmo
- **Tratamento de Eventos**: Mouse drag, hover e click handlers
- **Responsivo**: Grid adaptável a diferentes tamanhos de tela
- **Acessibilidade**: Controles intuitivos e legendas claras

## 📱 Compatibilidade

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 💡 Ideias para Melhorias

- [ ] Adicionar algoritmo de Bellman-Ford
- [ ] Implementar busca bidirecional
- [ ] Adicionar pesos às células
- [ ] Salvar e carregar mapas
- [ ] Modo escuro
- [ ] Exportar animação como GIF

## 👨‍💻 Autor

**Alyson de Oliveira Camargo**
- GitHub: [@AlysonCamargo](https://github.com/AlysonCamargo)


## 🙏 Agradecimentos

- Inspirado pelos visualizadores clássicos de pathfinding
- Comunidade de algoritmos e estruturas de dados
- Todos os contribuidores open-source

---

⭐ Se este projeto foi útil, considere dar uma estrela!

📚 Ideal para aprender algoritmos de busca e grafos de forma visual e interativa.

