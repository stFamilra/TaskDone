// src/App.tsx
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';

const App = observer(() => {
  const { projectStore } = useStore();

  return (
    <div>
      <h1>TaskDone</h1>
      <h2>Проекты:</h2>
      <ul>
        {projectStore.projects.map((project) => (
          <li key={project.id}>
            <strong>{project.title}</strong> — {project.description}
            <button onClick={() => projectStore.deleteProject(project.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <button onClick={() => projectStore.addProject('Новый проект', 'Описание')}>
        Добавить проект
      </button>
    </div>
  );
});

export default App;
