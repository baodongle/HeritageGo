/* global mHeritageGoService */
let isLoading = false

// Render Photography Posts
function renderPhoto (image, photoPost, mainContent) {
  mHeritageGoService
    .getPhoto(image)
    .then(photo => {
      let lang = $('#defaultLang').clone()
      let languages = navigator.languages
      let i
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

      // set and add new language to dropdown list
      lang.removeAttr('id')
      for (i = 0; i < languages.length; i++) {
        if (languages[i].length === 2) {
          lang.text(ISO_639_ALPHA2_CODE_TO_ISO_639_ALPHA3_CODE_MAPPING[languages[i]])
          lang.toggleClass('d-none d-block')
          photoPost.find('.dropdown-menu').append(lang[0].outerHTML)
        }
      }

      photoPost.find('.dropdown-item').click(function () {
        $('.post__detail').find('.show').each(function () {
          $(this).removeClass('show')
        })
        if (photoPost.find('.language').hasClass('.d-none')) {
          changeInterface(photoPost)
        }
        photoPost.find('language').html($(this).html())
      })
      // catch event enter to post data to server by api
      photoPost.find('.caption').keypress(function (event) {
        let caption
        let locale
        let photoId = photo.photo_id
        let keycode = event.keyCode ? event.keyCode : event.which
        if (keycode === '13') {
          caption = photoPost.find('.caption').val()
          locale = photoPost.find('.language').html()
          photoPost.find('.language').html('')
          changeInterface(photoPost)
          mHeritageGoService.suggestPhotoCaption(photoId, caption, locale).catch(error => {
            console.log(error)
          })
        }
      })

      $(photoPost.find('.post__ic-translate')).click(function () {
        if ($(this).css('animation-play-state') === 'running') {
          $(this).css('animation-play-state', 'paused')
        } else {
          $(this).css('animation-play-state', 'running')
        }
      })

      photoPost.hide().appendTo(mainContent).fadeIn()
    })
    .catch(error => {
      console.log(error)
    })
}

function changeInterface (post) {
  post.find('.post__ic-translate').toggleClass('d-none d-block')
  post.find('.post__caption').toggleClass('d-none')
  post.find('.caption').toggleClass('d-none d-block')
  post.find('.language').toggleClass('d-none d-block')
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

$(document).click(function (event) {
  let list = $($(this).find('.post'))
  let target = $(event.target).parents()
  let i
  for (i = 0; i < list.length; i++) {
    if ($(list[i]).find('.post__ic-translate').css('animation-play-state') === 'paused') {
      $('.post__ic-translate').css('animation-play-state', 'running')
    }
    if ($(target[target.length - 2]).is(list[i]) && $(list[i]).find('.language').hasClass('d-none')) {
      changeInterface($(list[i]))
    }
  }
})

$(function () {
  let ignored = 3
  const main = $('main')
  const clonedMain = main.clone()
  let paddingTopMain = Number.parseInt(main.css('padding-top'))
  let list
  let i
  clonedMain.css('padding-top', $('header').height() + paddingTopMain + 50)
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

    $('.post__ic-translate').css('animation-play-state', 'running')
    $('.post__detail').find('.show').each(function () {
      $(this).removeClass('show')
    })
    list = $($(document).find('.post'))
    for (i = 0; i < list.length; i++) {
      if ($(list[i]).find('.language').hasClass('d-block')) {
        changeInterface($(list[i]))
        break
      }
    }
  })
})
