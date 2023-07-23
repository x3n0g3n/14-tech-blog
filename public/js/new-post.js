const newChessPostFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#title-new-chess-post').value.trim();
  const content = document.querySelector('#content-new-chess-post').value.trim();

  if (title && content) {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard'); 
    } else {
      alert('Failed to create a new post.'); 
    }
  }
};

const newChessPostForm = document.querySelector('.new-chess-post-form');
if (newChessPostForm) {
  newChessPostForm.addEventListener('submit', newChessPostFormHandler);
}
