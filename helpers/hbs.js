const moment = require('moment')

function dateDifference(createdAt, now) {
  const createdDate = moment(createdAt).utc();
  const currentDate = moment(now).utc();
  const diffDuration = moment.duration(currentDate.diff(createdDate));

  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();




  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
       
        return '방금 전';
      } else {

        return `${minutes}분 전`;
      }
    } else {
     
      return `${hours}시간 전`;
    }
  } else if (days <= 7) {
  
    return `${days}일 전`;
  } else {
  
    return createdDate.format('YYYY년 MM월 DD일 ');
  }

}


module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },

  
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
 
  dateDifference: dateDifference,

  
  ifEqual: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
},
contains: function(array, element, options) {
  return array.includes(element) ? options.fn(this) : options.inverse(this);
},


 
}
