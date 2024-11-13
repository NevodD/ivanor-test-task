import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
	const loader = ref(false);
	const error = ref(false)

	return {
		loader,
		error,
	}
})
