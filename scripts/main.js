var app = new Vue({
  el: '#app',
  data: {
    page: 1,
    images: []
  },

  mounted () {
    this.fetchImages(this.page)
  },

  methods: {
    initPep: function () {
      var self = this
      $('.pep').pep({
        droppable: '.drop-target',
        drag: function (ev, obj) {
          console.log('There are ' + this.activeDropRegions.length + 'active drop regions.')
        },
        revert: true,
        revertIf: function (ev, obj) {
          return !this.activeDropRegions.length
        },
        // stop: self.validateCentering,
        rest: self.validateCentering,
        constrainTo: 'window',
        useBoundingClientRect: true
      })
    },

    validateCentering: function (ev, obj) {
      if (obj.activeDropRegions.length > 0) {
        this.centerWithin(obj)
      }
    },
    centerWithin: function (obj) {
      var $parent = obj.activeDropRegions[0]
      var pTop = $parent.offset().top
      var pLeft = $parent.offset().left
      var pHeight = $parent.outerHeight()
      var pWidth = $parent.outerWidth()

      var oTop = obj.$el.offset().top
      var oLeft = obj.$el.offset().left
      var oHeight = obj.$el.outerHeight()
      var oWidth = obj.$el.outerWidth()

      var cTop = pTop + (pHeight / 2)
      var cLeft = pLeft + (pWidth / 2)

      if (!obj.noCenter) {
        if (!obj.shouldUseCSSTranslation()) {
          var moveTop = cTop - (oHeight / 2)
          var moveLeft = cLeft - (oWidth / 2)
          obj.$el.animate({ top: moveTop, left: moveLeft }, 50)
        } else {
          var moveTop = (cTop - oTop) - oHeight / 2
          var moveLeft = (cLeft - oLeft) - oWidth / 2

          console.log(oTop, oLeft)
          obj.moveToUsingTransforms(moveTop, moveLeft)
        }

        obj.noCenter = true
        return
      }

      obj.noCenter = false
    },

    fetchImages: function (page = 1) {
      var self = this
      $.ajax({
        url: 'https://api.imgur.com/3/gallery/r/fashion/asc/week/' + page,
        headers: {'authorization': 'Client-ID 6859becb1bad706'}
      }).done(function (response) {
        self.images = []
        response.data.forEach(function (entry) {
          if (self.images.length < 6) {
            self.images.push(entry.link)
          }
        })

        Vue.nextTick(function () {
          self.initPep()
        })
      })
    }
  }
})

console.log(app)
