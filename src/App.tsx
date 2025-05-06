import { useState } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [options, setOptions] = useState({
    'tipo-levantamento': 'estatico',
    'modelo-antena': 'Nao alterar RINEX',
    email: '',
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults([]);
    if (!files || files.length === 0) {
      setError('Selecione pelo menos um arquivo.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('arquivo', file);
    });
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('autorizacao-uso', 'true');
    try {
      const res = await fetch('https://servicodados.ibge.gov.br/api/v1/ppp', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.link) {
        setResults([{ original: files[0].name, link: data.link }]);
      } else {
        setError('Erro ao processar o arquivo.');
      }
    } catch (err) {
      setError('Erro ao conectar ao IBGE.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Processamento GNSS IBGE PPP</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Arquivos GNSS:</label>
          <input type="file" multiple onChange={handleFileChange} accept=".zip,.gz,.rnx,.obs,.??o" />
        </div>
        <div>
          <label>Tipo de Levantamento:</label>
          <select name="tipo-levantamento" value={options['tipo-levantamento']} onChange={handleOptionChange}>
            <option value="estatico">Estático</option>
            <option value="cinematico">Cinético</option>
          </select>
        </div>
        <div>
          <label>Modelo da Antena:</label>
          <input name="modelo-antena" value={options['modelo-antena']} onChange={handleOptionChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={options.email} onChange={handleOptionChange} type="email" />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Processando...' : 'Enviar'}</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {results.length > 0 && (
        <div>
          <h2>Resultados:</h2>
          <ul>
            {results.map((r, i) => (
              <li key={i}>
                {r.original}: {r.link ? (
                  <a href={r.link} target="_blank" rel="noopener noreferrer">Baixar resultado</a>
                ) : (
                  <span style={{color: 'red'}}>Erro ao obter link</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
