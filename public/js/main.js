/**
 * @addBlog
 * Function handles creating a new blog 
 * based on user input
 */
const addBlog = async (event) => {
  // prevent default behavior
  event.preventDefault();
  // initialize variables
  const blogTitle = document.querySelector('#blog-title').value,
        blogContent = document.querySelector('#blog-content').value,
        userId = document.querySelector('#blog-user-id').value;
  // if all elements have a value
  if (blogTitle && blogContent && userId) {
    // the response received from the POST request
    const response = await fetch('/api/blog/add', {
      method: 'POST',
      body: JSON.stringify({ post_title: blogTitle, post_content: blogContent, user_id: userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    // if reponse ok
    if (response.ok) {
      // initialize variables
      let successMsg = document.querySelector('.success-msg');
      // show success message
      successMsg.classList.remove('hidden');
      // call @clearBlog function
      clearBlog(event);
      // call @updateBlogList function
      updateBlogList();

    } 
    // else if response is not ok
    else {
      // alert prompt with response status text
      alert(response.statusText);
    }
  } 
  // else if elements are missing a value
  else {      
    // initialize variables
    const titleErr = document.querySelector('.title-err'),
          detailsErr = document.querySelector('.details-err');
    // if missing title, show title error message
    if (!blogTitle) {
      titleErr.classList.remove('hidden');
    }
    // if missing body, show body error message
    if (!blogContent) {
      detailsErr.classList.remove('hidden');
    }
  }
};

/**
 * @updateBlogList
 * Updates the authenticated users
 * dashboard list 
 */
const updateBlogList = async () => {
  // the response received from the GET request
  const response = await fetch(`/api/blog/list/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  // if reponse ok
  if (response.ok) {
    // initialize variables
    const success = await response.json(),
          blogFeed = document.getElementById('blog-feed');
    // clear the div
    blogFeed.innerHTML = '';
    // loop through the data
    success.data.forEach((user) => {
      // loop through the data
      user.Posts.forEach((post) => {
        // initialize variables
        const formattedDate = moment(post.post_date).format('MMMM Do YYYY, h:mm a'),
              postElement = document.createElement('div');
        // add a class
        postElement.classList.add('event');
        // update the innerHTML
        postElement.innerHTML = `
          <div class="label">
            <i class="pencil icon"></i>
          </div>
          <div class="content">
            <div class="summary">
              You posted <a href="javascript:void(0)" onclick="showBlog('${post.id}')">${post.post_title}</a>
              <div class="date">${formattedDate}</div>
            </div>
          </div>
        `;
        // append the new list item
        blogFeed.appendChild(postElement);
      });
    });
  } 
  // else if response is not ok
  else {
    // alert prompt with response status text
    alert(response.statusText);
  }
};

/**
 * @updateBlog
 * Allows a user to update a previously
 * created blog when they are authenticated
 */
const updateBlog = async (event,postId) => {
  // prevent default behavior
  event.preventDefault();
  // initialize variables
  const blogTitle = document.querySelector('#updated-blog-title').value,
        blogContent = document.querySelector('#updated-blog-content').value;
  // if all elements have a value
  if (blogTitle && blogContent && postId) {
    // the response received from the PUT request
    const response = await fetch(`/api/blog/update/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ post_title: blogTitle, post_content: blogContent }),
      headers: { 'Content-Type': 'application/json' },
    });
    // if reponse ok
    if (response.ok) {
      // initialize variables
      var successMsg = document.querySelector('.success-msg');
      // show success message
      successMsg.classList.remove('hidden');
    } 
    // else if response is not ok
    else {
      // alert prompt with response status text
      alert(response.statusText);
    }
  }
  // else if elements are missing a value 
  else {      
    // initialize variables
    const titleErr = document.querySelector('.title-err'),
          detailsErr = document.querySelector('.details-err');
    // if missing title
    if (!blogTitle) {
      // display the title error message
      titleErr.classList.remove('hidden');
    }
    // if missing the body
    if (!blogContent) {
      // display body error message
      detailsErr.classList.remove('hidden');
    }
  }
};

/**
 * @deleteBlog
 * Allows a user to delete a previously
 * created blog when they are authenticated
 */
const deleteBlog = async (event,postId) => {
  // prevent default behavior
  event.preventDefault();
  // the response received from the DELETE request
  const response = await fetch(`/api/blog/delete/${postId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  // if reponse ok
  if (response.ok) {
    // redirect the user to the dashboard
    document.location.replace('/dashboard');
  } 
  // else if response is not ok
  else {
    // alert prompt with response status text
    alert(response.statusText);
  }
};

/**
 * @addComment
 * Allows a user to add a comment
 * to any blog they are currently
 * viewing
 */
const addComment = async (event, postId) => {
  // prevent default behavior
  event.preventDefault();
  // initialize variables
  const commentContent = document.querySelector('#comment-content').value,
        userId = document.querySelector('#user-id').value;
  // if all elements have a value
  if (commentContent && userId && postId) {
    // the response received from the POST request
    const response = await fetch('/api/comment/add', {
      method: 'POST',
      body: JSON.stringify({ comment_content: commentContent, user_id: userId, post_id: postId }),
      headers: { 'Content-Type': 'application/json' },
    });
    // if reponse ok
    if (response.ok) {
      // fetch the updated comments for the specific post
      const commentsResponse = await fetch(`/api/comment/getComments/${postId}`);
      // if reponse ok
      if (commentsResponse.ok) {
        // initialize variables
        const commentsData = await commentsResponse.json();
        // update the comments section with the recently added comments
        updateComments(commentsData, postId);
      }
      // else if response is not ok
      else {
        // alert prompt with response status text
        alert(commentsResponse.statusText);
      }
    }
    // else if response is not ok
    else {
      // alert prompt with response status text
      alert(response.statusText);
    }
  }
};

/**
 * @updateComments
 * Rebuilds the comment section when a user
 * adds a new comment
 */
const updateComments = (commentsData, postId) => {
  // initialize variables
  const commentsWrapper = document.querySelector(`#comments-wrapper-${postId}`),
        commentsLength = document.querySelector(`.comments-length`),
        lengthDiv = document.createElement('div');
  // empty the div
  commentsLength.innerHTML = '';
  // add classes
  lengthDiv.className = 'content comments-length';
  // add the comment icon with the length of the commentsData object
  lengthDiv.innerHTML = `
    <i class="comment icon"></i>
    ${commentsData.length} comments
  `;
  // empty the div
  commentsWrapper.innerHTML = '';
  // loop through the comments data
  commentsData.forEach((comment) => {
    // initialize variables
    const commentElement = document.createElement('div'),
          formattedDate = moment(comment.comment_date).format('MMMM Do YYYY, h:mm a');
    // add a class
    commentElement.className = 'comment';
    // create the comment
    commentElement.innerHTML = `
      <div class="content">
        <a class="author">${comment.user.user_name}</a>
        <div class="metadata">
          <div class="date">${formattedDate}</div>
        </div>
        <div class="text">${comment.comment_content}</div>
      </div>
    `;
    // append comment count
    commentsLength.appendChild(lengthDiv);
    // append comment
    commentsWrapper.appendChild(commentElement);
  });
  // initialize variables
  const formElement = document.createElement('div');
  // create the comment form
  formElement.innerHTML = `
    <form class="ui reply form">
      <div class="field">
        <textarea id="comment-content" required></textarea>
      </div>
      <div class="ui primary submit labeled icon button" onclick="addComment(event,{{post.id}})">
        <i class="icon edit"></i> Add Reply
      </div>
    </form>
  `;
  // append the form
  commentsWrapper.appendChild(formElement);
};

/**
 * @clearBlog
 * Clears the new post form fields 
 * and sets focus to the title input
 */
function clearBlog(event) {
  // prevent default behavior
  event.preventDefault();
  // initialize variables
  const title = document.querySelector('#blog-title'),
        content = document.querySelector('#blog-content');
  // clear the title
  title.value = '';
  // clear the body
  content.value = '';
  // focus the title input
  title.focus();
}

/**
 * @toggleTab
 * Adds functionality to toggle
 * between login/signup on the
 * login page
 */
function toggleTab(event) {
  // prevent default behavior
  event.preventDefault();
  // initialize variables
  const clickedTab = event.target,
        tabId = clickedTab.dataset.tab,
        tabs = document.querySelectorAll(`[data-tab]`),
        tabContents = document.querySelectorAll(`.tab-content`);
  // loop through the tabs
  tabs.forEach(tab => {
    // if current tab id === clicked tab
    if (tab.dataset.tab === tabId) {
      // add active class
      tab.classList.add('active');
    } 
    // if current tab id != clicked tab
    else {
      // remove active class
      tab.classList.remove('active');
    }
  });
  // loop through the tabContents
  tabContents.forEach(tabContent => {
    // if current tab id === clicked tab
    if (tabContent.dataset.tab === tabId) {
      // add active class
      tabContent.classList.add('active');
    } 
    // if current tab id != clicked tab
    else {
      // remove active class
      tabContent.classList.remove('active');
    }
  });
}

function toggleComments(element,postId) {
  const showBtn = element.querySelector('.show-btn'),
        hideBtn = element.querySelector('.hide-btn'),
        commentsWrapper = document.getElementById("comments-wrapper-" + postId);
  
  showBtn.classList.toggle('hidden');
  hideBtn.classList.toggle('hidden');
  commentsWrapper.classList.toggle('hidden');
}

/**
 * @closeMsg
 * Accepts a value, and hides the 
 * specific message that was clicked
 * for close
 */
const closeMsg = (val) => {
  // initialize variables
  const successMsg = document.querySelector('.success-msg');
      titleErr = document.querySelector('.title-err'),
      detailsErr = document.querySelector('.details-err');
  // if title
  if (val === 'title') {
    // hide title message
    titleErr.classList.add('hidden');
  } 
  // if details
  else if (val === 'details') {
    // hide details message
    detailsErr.classList.add('hidden');
  } 
  // if success
  else if (val === 'success') {
    // hide success message
    successMsg.classList.add('hidden');
  } 
};

/**
 * @showBlog
 * Redirects user to page that displays
 * the blog details for blogs the 
 * authenticated user has created
 */
const showBlog = (postId) => {
  // reload the dashboard with the post id as a url parameter
  document.location.replace(`/dashboard/${postId}`);
};

