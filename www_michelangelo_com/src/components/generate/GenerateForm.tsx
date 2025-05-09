import React from 'react';

export default function GenerateForm() {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现生成图片的逻辑
    console.log('生成图片:', prompt);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="prompt">提示词</label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          placeholder="请输入图片描述..."
        />
      </div>
      <button type="submit">生成</button>
    </form>
  );
} 