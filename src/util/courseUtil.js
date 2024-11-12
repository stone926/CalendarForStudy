function getCourseType(type) {
	if (type === "restricted") {
		return "限修";
	} else if (type === "must") {
		return "必修";
	} else if (type === "free") {
		return "任修";
	} else {
		return "未知";
	}
}

function getCourseCategory(category) {
	if (category === "four") {
		return "四类";
	} else if (category === "art") {
		return "美育";
	} else if (category === "introduction") {
		return "导论";
	} else {
		return "未知";
	}
}

function getBoyaCategory(category) {
	if (category === "labor") {
		return "劳育";
	} else if (category === "art") {
		return "美育";
	} else if (category === "morality") {
		return "德育";
	} else {
		return "未知";
	}
}

function getDay(day) {
	switch (day) {
		case 1:
			return "周一";
		case 2:
			return "周二";
		case 3:
			return "周三";
		case 4:
			return "周四";
		case 5:
			return "周五";
		case 6:
			return "周六";
		case 0:
      return "周日";
    default:
      return "未知";
	}
}

export { getCourseType, getCourseCategory, getBoyaCategory, getDay };
