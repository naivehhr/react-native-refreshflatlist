import Immutable from 'immutable'

const makeData = (lastI=0) => {
	return [...'a'.repeat(10)].map((value, index) => {
		return {
			title: 'Item ' + (lastI + index),
			text: '凹凸曼' + (lastI + index),
			key: (lastI + index),
		}
	})
}

const makeDataImmttable = (lastI=0) => {
	return Immutable.fromJS([...'a'.repeat(10)].map((value, index) => {
		return {
			title: 'Item ' + (lastI + index),
			text: '凹凸曼' + (lastI + index),
			key: (lastI + index),
		}
	}))
}

export default Utils = {
	makeData,
	makeDataImmttable
}
