/* global mHeritageGoService */
let isLoading = false

// Render Photography Posts
function renderPhoto (image, photoPost, mainContent) {
  mHeritageGoService
    .getPhoto(image)
    .then(photo => {
      photoPost
        .find('.post__avatar')
        .attr('src', `http:${photo.account.picture_url}`)
      photoPost.find('.post__caption').html(photo.title[0].content)
      photoPost.find('.post__area-name').html(photo.area_name)
      photoPost
        .find('.post__photo')
        .attr({
          'src': `http:${photo.image_url}?size=medium`,
          'alt': photo.title[0].content
        })
      if (photo.capture_time) {
        photoPost.find('.post__date').find('span').html(photo.capture_time)
      } else {
        photoPost.find('.post__date').remove()
      }
      photoPost.find('.post__like-count').html(photo.like_count)
      photoPost.find('.post__comment-count').html(photo.comment_count)
      photoPost.find('.post__view-count').html(photo.view_count)

      photoPost.hide().appendTo(mainContent).fadeIn()
    })
    .catch(error => {
      console.log(error)
    })
}

function renderPhotos (ignored) {
  let main = $('main')
  mHeritageGoService
    .getPhotos({
      limit: 2,
      offset: ignored
    })
    .then(photos => {
      let postId = $('#defaultPost')
      isLoading = false
      $(photos).each(function () {
        let newPost = postId.clone()
        newPost.removeAttr('id')
        newPost.removeAttr('hidden')
        renderPhoto(this, newPost, main)
      })
    })
    .catch(error => {
      console.log(error)
    })
}

$(function () {
  let ignored = 3
  const clonedMain = $('main').clone()
  clonedMain.css('padding-top', $('header').height() + 20)
  $('.blur-background').append(clonedMain)
  renderPhotos(ignored)
  isLoading = false
  $(window).scroll(function () {
    $('.blur-background').find('main').css({
      transform: `translateY(-${$(window).scrollTop()}px)`,
      '-webkit-transform': `translateY(-${$(window).scrollTop()}px)`
    })
    if (!isLoading) {
      if ($(window).scrollTop() >= $(document).height() - $(window).height() - 1500) {
        isLoading = true
        ignored += 2
        renderPhotos(ignored)
      }
    }
  })
})
