<script lang="ts">
import { defineComponent, ref, watchEffect } from '@vue/composition-api'
import { BButton, BFormCheckbox, BImg } from 'bootstrap-vue'

import utils from '@/chrome'
import i18n from '@/i18n'
import QuickActivate from '@/components/QuickActivate.vue'

const MainMenu = defineComponent({
  components: {
    // BoostrapVue Icons
    // BIconHandIndexThumb,
    // BoostrapVue Components
    BButton,
    BFormCheckbox,
    BImg,
    // Custom Components
    QuickActivate
  },
  setup() {
    const readaptEnabled = ref(true)

    const { openSettings, sendMessageToCurrentTab, newSettings, openTemplates, broadcastMessage, getEnabled, saveEnabled } = utils

    watchEffect(async () => (readaptEnabled.value = await getEnabled()))

    const switchEnabled = async () => {
      readaptEnabled.value = !readaptEnabled.value
      await saveEnabled(readaptEnabled.value)
      const message = readaptEnabled.value ? 'ENABLE' : 'DISABLE'
      await broadcastMessage(message)
    }

    const adapt = async () => await sendMessageToCurrentTab('ADAPT')
    const reset = async () => await sendMessageToCurrentTab('RESET')
    const selectTemplate = async () => await openTemplates()

    const changeLocale = async (lang: 'en' | 'fr') => {
      i18n.locale = lang
      await utils.saveLocale(lang)
    }

    return {
      readaptEnabled,
      openSettings,
      newSettings,
      sendMessageToCurrentTab,
      broadcastMessage,
      openTemplates,
      // methods,
      switchEnabled,
      adapt,
      reset,
      selectTemplate,
      changeLocale
    }
  }
})
export default MainMenu
</script>

<template>
  <div class="container-fluid" style="max-width: 600px">
    <div class="mt-2 d-flex justify-content-between align-items-center">
      <div>
        <!--<b-button class="mr-2" size="sm" variant="primary" @click="adapt()" :disabled="!readaptEnabled">-->
        <!--  {{ $t('MAIN_MENU.ADAPT_PAGE') }}-->
        <!--</b-button>-->
        <b-button size="sm" variant="outline-primary" @click="reset()" :disabled="!readaptEnabled">
          {{ $t('MAIN_MENU.RESET') }}
        </b-button>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="mr-3" style="font-size: 14px">
          <span class="mr-2"> {{ $t('MAIN_MENU.MENU_LANGUAGE') }}</span>
          <span v-if="$i18n.locale === 'fr'">FR</span>
          <a v-if="$i18n.locale !== 'fr'" href="#" @click="changeLocale('fr')">FR</a>
          /
          <span v-if="$i18n.locale === 'en'">EN</span>
          <a v-if="$i18n.locale !== 'en'" href="#" @click="changeLocale('en')">EN</a>
        </div>
        <b-img class="logo" :src="require('../assets/logo.png')" alt="readapt-logo" />
      </div>
    </div>

    <div class="d-flex justify-content-start align-items-center mt-2">
      <label class="form-check-label mr-2">{{ $t('MAIN_MENU.READAPT_ACTIVE') }}</label>
      <b-form-checkbox switch :checked="readaptEnabled" @change="switchEnabled" />
    </div>

    <div class="mt-3">
      <h5>{{ $t('MAIN_MENU.ADAPT_TEXT_BY') }}</h5>
      <ul class="help">
        <!-- <li>-->
        <!--   <b-icon-hand-index-thumb />-->
        <!--   {{ $t('MAIN_MENU.CLICKING_ADAPT_PAGE_BUTTON') }}-->
        <!-- </li>-->
        <!-- <li>{{ $t('MAIN_MENU.RIGHT_CLICK_AND_SELECT_ADAPT') }}</li>-->
        <li>{{ $t('MAIN_MENU.HOLD_CMD_AND_CLICK_TARGET') }}</li>
      </ul>
    </div>

    <div class="my-3 d-flex justify-content-between align-items-center">
      <b-button size="sm" variant="primary" @click="openSettings" style="max-width: 150px">
        {{ $t('MAIN_MENU.SEE_MODIFY_CURRENT_PROFILE') }}
      </b-button>

      <b-button size="sm" variant="primary" @click="newSettings" style="max-width: 150px">
        {{ $t('MAIN_MENU.CREATE_BRAND_NEW_PROFILE') }}
      </b-button>

      <b-button size="sm" variant="primary" @click="selectTemplate" style="max-width: 150px">
        {{ $t('MAIN_MENU.BASE_YOUR_PROFILE_FROM_TEMPLATE') }}
      </b-button>

      <!--            <b-button size="sm" variant="primary" disabled>-->
      <!--              {{ $t('MAIN_MENU.I_HAVE_PROFILE_CODE') }}-->
      <!--            </b-button>-->
    </div>

    <QuickActivate />
    <div class="my-2 d-flex justify-content-end align-items-center">
      <a href="https://forms.gle/ciWCnYnkFjutwEHWA" target="_blank" class="mr-2">
        <b-button size="sm" variant="primary">{{ $t('MAIN_MENU.TELL_US_ABOUT_YOU') }}</b-button>
      </a>
      <a href="https://forms.gle/9pv3HCmtPQN8Akpn9" target="_blank">
        <b-button size="sm" variant="primary">{{ $t('MAIN_MENU.CONTACT_US') }}</b-button>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.help {
  font-size: 12px;
}

.logo {
  width: 169px;
}

.list-group {
  max-height: 200px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
