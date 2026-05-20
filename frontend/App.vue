<template>
  <div class="container">
    <header class="header">
      <h1>📔 小小日记</h1>
      <button class="btn btn-primary" @click="openModal()">写日记</button>
    </header>

    <div class="diary-list">
      <div v-if="loading" class="empty-state">
        <h2>加载中...</h2>
      </div>
      
      <div v-else-if="diaries.length === 0" class="empty-state">
        <h2>还没有日记</h2>
        <p>点击上方按钮开始写第一篇日记吧！</p>
      </div>
      
      <div v-else>
        <div v-for="diary in diaries" :key="diary.id" class="diary-card">
          <div class="diary-header">
            <h3 class="diary-title">{{ diary.title }}</h3>
          </div>
          <div class="diary-meta">
            <span>📅 {{ formatDate(diary.created_at) }}</span>
            <span v-if="diary.weather">🌤 {{ diary.weather }}</span>
            <span v-if="diary.mood">😊 {{ diary.mood }}</span>
          </div>
          <div class="diary-content">{{ diary.content }}</div>
          <div class="diary-actions">
            <button class="btn btn-secondary" @click="openModal(diary)">编辑</button>
            <button class="btn btn-danger" @click="deleteDiary(diary.id)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingDiary ? '编辑日记' : '写日记' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="saveDiary">
          <div class="form-group">
            <label>标题</label>
            <input v-model="form.title" type="text" required placeholder="给日记起个标题...">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>天气</label>
              <select v-model="form.weather">
                <option value="">选择天气</option>
                <option value="晴天">晴天</option>
                <option value="多云">多云</option>
                <option value="阴天">阴天</option>
                <option value="雨天">雨天</option>
                <option value="雪天">雪天</option>
              </select>
            </div>
            <div class="form-group">
              <label>心情</label>
              <select v-model="form.mood">
                <option value="">选择心情</option>
                <option value="开心">开心</option>
                <option value="平静">平静</option>
                <option value="难过">难过</option>
                <option value="兴奋">兴奋</option>
                <option value="疲惫">疲惫</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>内容</label>
            <textarea v-model="form.content" required placeholder="写下今天的故事..."></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const diaries = ref([])
    const loading = ref(true)
    const showModal = ref(false)
    const editingDiary = ref(null)
    const form = ref({
      title: '',
      content: '',
      weather: '',
      mood: ''
    })

    const API_BASE = '/api'

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const fetchDiaries = async () => {
      try {
        loading.value = true
        const res = await fetch(`${API_BASE}/diaries`)
        const data = await res.json()
        if (data.success) {
          diaries.value = data.data
        }
      } catch (err) {
        console.error('获取日记失败:', err)
      } finally {
        loading.value = false
      }
    }

    const openModal = (diary = null) => {
      editingDiary.value = diary
      if (diary) {
        form.value = { ...diary }
      } else {
        form.value = { title: '', content: '', weather: '', mood: '' }
      }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      editingDiary.value = null
    }

    const saveDiary = async () => {
      try {
        let res
        if (editingDiary.value) {
          res = await fetch(`${API_BASE}/diaries/${editingDiary.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
          })
        } else {
          res = await fetch(`${API_BASE}/diaries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
          })
        }
        
        const data = await res.json()
        if (data.success) {
          closeModal()
          fetchDiaries()
        }
      } catch (err) {
        console.error('保存日记失败:', err)
      }
    }

    const deleteDiary = async (id) => {
      if (!confirm('确定要删除这篇日记吗？')) return
      
      try {
        const res = await fetch(`${API_BASE}/diaries/${id}`, {
          method: 'DELETE'
        })
        const data = await res.json()
        if (data.success) {
          fetchDiaries()
        }
      } catch (err) {
        console.error('删除日记失败:', err)
      }
    }

    onMounted(() => {
      fetchDiaries()
    })

    return {
      diaries,
      loading,
      showModal,
      editingDiary,
      form,
      formatDate,
      openModal,
      closeModal,
      saveDiary,
      deleteDiary
    }
  }
}
</script>
