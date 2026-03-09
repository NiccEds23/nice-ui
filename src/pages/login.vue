<template>
  <div class="login-page">
    <div class="dynamic-bg"></div>
    <div class="login-container glass-card">
      <!-- Left Panel (Brand) -->
      <div class="brand-panel">
        <div>
          <div class="logo-box">
            <span class="material-symbols-outlined icon">layers</span>
          </div>
          <h1 class="brand-title">
            Next-Gen <br/>
            <span class="highlight">Enterprise</span> <br/>
            Control.
          </h1>
          <p class="brand-subtitle">
            Unified management for modern scale operations.
          </p>
        </div>
        <div class="brand-footer">
          <div class="status-indicator">
            <span class="dot pulse"></span>
            System Status: Operational
          </div>
          <p class="version">v4.0.26 Glass Engine</p>
        </div>
      </div>

      <!-- Right Panel (Form) -->
      <div class="form-panel">
        <div class="form-header">
          <h2>Access Your Enterprise</h2>
          <p>Identify yourself to enter the dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="d-flex flex-col gap-6 w-full">
          <BaseInput 
            id="username"
            v-model="username"
            label="Identity Token / Email"
            placeholder="Username or Email"
            icon="person"
            required
          />

          <div class="d-flex flex-col gap-2">
            <div class="d-flex justify-between items-end">
                <label class="text-xs font-bold uppercase tracking-wider text-muted ml-1">Security Key</label>
                <a href="#" class="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors no-underline">Reset Access</a>
            </div>
            <BaseInput 
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••••••"
                icon="key"
                required
            />
          </div>

          <div class="d-flex items-center">
             <BaseSwitch v-model="rememberMe" label="Maintain active session" />
          </div>

          <BaseButton type="submit" block size="lg" icon-right="arrow_forward">
            Unlock Dashboard
          </BaseButton>
        </form>

        <div class="divider-section">
          <div class="line"></div>
          <div class="text-wrapper">
            <span>Enterprise Biometric SSO</span>
          </div>
        </div>

        <BaseButton variant="secondary" block outlined icon="fingerprint" class="sso-btn">
          Verify with Passkey
        </BaseButton>
      </div>
    </div>
    
    <div class="page-footer">
      <p>Encrypted Connection • 2024 Global Systems</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { definePage } from 'unplugin-vue-router/runtime'

definePage({
  meta: {
    layout: 'auth',
  },
})

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const router = useRouter()

const handleLogin = () => {
  // Add authentication logic here
  console.log('Login attempt:', { username: username.value, rememberMe: rememberMe.value })
  // Temporary redirect
  router.push('/')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;
@use '@/assets/styles/login_mixins' as *;

.login-page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  color: $text-primary;
  position: relative;
  overflow: hidden;
}

.dynamic-bg {
  @include dynamic-bg-login;
}

.login-container {
  width: 100%;
  max-width: 900px;
  display: grid;
  border-radius: 2.5rem;
  overflow: hidden;
  @include login-glass-card;

  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
  }
}

.brand-panel {
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    grid-column: span 5;
    padding: 3rem;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(239, 246, 255, 0.8) 0%, transparent 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.6);
  }

  .logo-box {
    width: 3.5rem;
    height: 3.5rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    margin-bottom: 2rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    .icon {
      font-size: 1.875rem;
      color: $primary-hover;
    }
  }

  .brand-title {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: $text-primary;
    line-height: 1.1;
    margin: 0;

    .highlight {
      color: $primary-hover;
    }
  }

  .brand-subtitle {
    margin-top: 1.5rem;
    color: $text-secondary;
    font-size: 1.125rem;
    line-height: 1.625;
  }

  .brand-footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: $text-secondary;

      .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: #10b981; // emerald-500
        
        &.pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      }
    }

    .version {
      font-size: 0.75rem;
      color: $text-muted;
    }
  }
}

.form-panel {
  grid-column: span 12;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    grid-column: span 7;
    padding: 4rem;
  }

  .form-header {
    margin-bottom: 2.5rem;

    h2 {
      font-size: 1.875rem;
      font-weight: 800;
      color: $text-primary;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
    }

    p {
      color: $text-secondary;
    }
  }
}

.divider-section {
  position: relative;
  margin: 2.5rem 0;

  .line {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      width: 100%;
      border-top: 1px solid $neutral-200;
    }
  }

  .text-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    
    span {
      padding: 0 1rem;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(4px);
      color: $text-muted;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: 700;
    }
  }
}

.page-footer {
  position: fixed;
  bottom: 2rem;
  width: 100%;
  text-align: center;
  pointer-events: none;
  
  p {
    color: $text-muted;
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-weight: 500;
    opacity: 0.6;
    margin: 0;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
