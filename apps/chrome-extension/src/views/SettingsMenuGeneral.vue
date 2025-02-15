<script lang="ts">
import { computed, defineComponent, onMounted } from '@vue/composition-api'
import { BFormCheckbox, BFormSelect, BTableSimple, BTbody, BTd, BTh, BTr, BThead } from 'bootstrap-vue'

import {
  fontFamilyOptions,
  fontSizeOptions,
  Language,
  languageOptions,
  letterSpacingOptions,
  lineSpacingOptions,
  opacityOptions,
  Option,
  Settings,
  SettingsKey,
  silentLetterOpacityOptions,
  wordSpacingOptions
} from '@readapt/settings'

import store from '@/store'
import router from '@/router'
import { ColorPicker, RangeBar, SelectPercentage } from '@readapt/shared-components'

const SettingsMenuGeneral = defineComponent({
  components: { BFormCheckbox, BFormSelect, BTableSimple, BTbody, BTr, BTh, BTd, BThead, SelectPercentage, RangeBar, ColorPicker },
  setup() {
    const settings = computed<Settings>(() => store.getters.getSettings)

    onMounted(async () => {
      if (router.currentRoute.query.newSettings === 'true') {
        await store.dispatch('newSettings')
      }
    })

    const lineSpacingOptionsOptimized = computed<Option[]>(() => {
      const { shadeAlternateLinesActive } = settings.value
      return shadeAlternateLinesActive ? lineSpacingOptions.slice(1) : lineSpacingOptions
    })

    const updateOption = (key: SettingsKey, value: unknown) => store.dispatch('updateOption', { key, value })

    const updateShadeAlternateLines = async (shadeAlternateLinesActive: string) => {
      await updateOption('shadeAlternateLinesActive', shadeAlternateLinesActive)
      // change lineSpacing value if lineSpacingOptionsOptimized has changed and current value is not selectable
      if (lineSpacingOptionsOptimized.value.length !== lineSpacingOptions.length && settings.value.lineSpacing === lineSpacingOptions[0].value) {
        await store.dispatch('updateOption', { key: 'lineSpacing', value: lineSpacingOptionsOptimized.value[0].value })
      }
    }

    const changeLanguage = (language: Language) => store.dispatch('changeLanguage', language)

    return {
      settings,
      fontFamilyOptions,
      fontSizeOptions,
      letterSpacingOptions,
      wordSpacingOptions,
      lineSpacingOptionsOptimized,
      languageOptions,
      opacityOptions,
      silentLetterOpacityOptions,
      updateOption,
      updateShadeAlternateLines,
      changeLanguage
    }
  }
})
export default SettingsMenuGeneral
</script>
<template>
  <div>
    <b-table-simple striped sticky-header="80vh" responsive>
      <b-thead>
        <b-tr>
          <b-th />
          <b-th />
          <b-th>{{ $t('GENERAL.SETTING') }}</b-th>
          <b-th>{{ $t('GENERAL.OPACITY') }}</b-th>
          <b-th>{{ $t('GENERAL.ACTIVATE') }}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr>
          <b-th class="bg-white">{{ $t('GENERAL.PROFILE_LANGUAGE') }}</b-th>
          <b-th />
          <b-td>
            <b-form-select :options="languageOptions" :value="settings.language" @change="changeLanguage($event)" />
          </b-td>
          <b-td />
          <b-td />
        </b-tr>
        <b-tr>
          <b-th rowspan="2" class="bg-white">
            {{ $t('GENERAL.FONT_SETTINGS') }}
          </b-th>
          <b-td>{{ $t('GENERAL.FONT') }}</b-td>
          <b-td>
            <b-form-select :options="fontFamilyOptions" :value="settings.fontFamily" @change="updateOption('fontFamily', $event)" />
          </b-td>
          <b-td />
          <b-td />
        </b-tr>
        <b-tr>
          <b-td>{{ $t('GENERAL.FONT_SIZE') }}</b-td>
          <b-td>
            <SelectPercentage :options="fontSizeOptions" :value="settings.fontSize" @change="updateOption('fontSize', $event)" />
          </b-td>
          <b-td />
          <b-td />
        </b-tr>
        <b-tr>
          <b-th rowspan="3" class="bg-white">
            {{ $t('GENERAL.SPACING') }}
          </b-th>
          <b-td>{{ $t('GENERAL.LETTER_SPACING') }}</b-td>
          <b-td>
            <SelectPercentage :options="letterSpacingOptions" :value="settings.letterSpacing" @change="updateOption('letterSpacing', $event)" />
          </b-td>
          <b-td />
          <b-td />
        </b-tr>
        <b-tr>
          <b-td>{{ $t('GENERAL.WORD_SPACING') }}</b-td>
          <b-td>
            <SelectPercentage :options="wordSpacingOptions" :value="settings.wordSpacing" @change="updateOption('wordSpacing', $event)" />
          </b-td>
          <b-td />
          <b-td />
        </b-tr>
        <b-tr>
          <b-td>{{ $t('GENERAL.LINE_SPACING') }}</b-td>
          <b-td>
            <SelectPercentage :options="lineSpacingOptionsOptimized" :value="settings.lineSpacing" @change="updateOption('lineSpacing', $event)" />
          </b-td>
          <b-td />
          <b-td />
        </b-tr>
        <b-tr>
          <b-th :rowspan="settings.language === 'fr' ? 3 : 2" class="bg-white">
            {{ $t('GENERAL.TEXT_HINT') }}
          </b-th>
          <b-td>{{ $t('GENERAL.HIGHLIGHT_ALTERNATING_SYLLABLES') }}</b-td>
          <b-td>
            <div class="d-flex justify-content-center">
              <ColorPicker class="m-1" :value="settings.syllableColor1" @selectColor="updateOption('syllableColor1', $event)" />
              <ColorPicker class="m-1" :value="settings.syllableColor2" @selectColor="updateOption('syllableColor2', $event)" />
            </div>
          </b-td>
          <b-td>
            <RangeBar :value="settings.syllableOpacity" :options="opacityOptions" @change="updateOption('syllableOpacity', $event)" />
          </b-td>
          <b-td>
            <b-form-checkbox :checked="settings.syllableActive" @change="updateOption('syllableActive', $event)" switch />
          </b-td>
        </b-tr>
        <b-tr v-if="settings.language === 'fr'">
          <b-td>{{ $t('GENERAL.SHOW_LIAISONS') }}</b-td>
          <b-td />
          <b-td>
            <RangeBar
              :disabled="settings.language === 'en'"
              :value="settings.liaisonsOpacity"
              :options="opacityOptions"
              @change="updateOption('liaisonsOpacity', $event)"
            />
          </b-td>
          <b-td>
            <b-form-checkbox :checked="settings.liaisonsActive" @change="updateOption('liaisonsActive', $event)" switch />
          </b-td>
        </b-tr>
        <b-tr>
          <b-td>{{ $t('GENERAL.GREY_SILENT_LETTERS') }}</b-td>
          <b-td />
          <b-td>
            <RangeBar
              :value="settings.silentLetterOpacity"
              :options="silentLetterOpacityOptions"
              @change="updateOption('silentLetterOpacity', $event)"
            />
          </b-td>
          <b-td>
            <b-form-checkbox :checked="settings.silentLetterActive" @change="updateOption('silentLetterActive', $event)" switch />
          </b-td>
        </b-tr>
        <b-tr>
          <b-th class="bg-white">{{ $t('GENERAL.READING_TOOLS') }}</b-th>
          <b-td>{{ $t('GENERAL.SHADE_ALTERNATE_LINES') }}</b-td>
          <b-td />
          <b-td>
            <RangeBar
              :value="settings.shadeAlternateLinesOpacity"
              :options="opacityOptions"
              @change="updateOption('shadeAlternateLinesOpacity', $event)"
            />
          </b-td>
          <b-td>
            <b-form-checkbox :checked="settings.shadeAlternateLinesActive" @change="updateShadeAlternateLines" switch />
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>
<style lang="scss" scoped></style>
