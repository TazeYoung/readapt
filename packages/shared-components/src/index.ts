import { VueConstructor } from 'vue'
import CompositionApi from '@vue/composition-api'

import ColorPicker from './components/forms/ColorPicker.vue'
import RangeBar from './components/forms/RangeBar.vue'
import SelectPercentage from './components/forms/SelectPercentage.vue'
import LanguageSelector from './components/forms/LanguageSelector.vue'
import SettingsSaveConfirmation from './components/modals/SettingsSaveConfirmation.vue'
import SettingsLeaveConfirmation from './components/modals/SettingsLeaveConfirmation.vue'
import SaveSettings from './components/buttons/SaveSettings.vue'
import CloseSettings from './components/buttons/CloseSettings.vue'

export default {
  install(Vue: VueConstructor) {
    Vue.component('readapt-color-picker', ColorPicker)
    Vue.component('readapt-range-bar', RangeBar)
    Vue.component('readapt-select-percentage', SelectPercentage)
    Vue.component('readapt-language-selector', LanguageSelector)
    Vue.component('readapt-settings-save-confirmation', SettingsSaveConfirmation)
    Vue.component('readapt-settings-leave-confirmation', SettingsLeaveConfirmation)
    Vue.component('readapt-save-settings', SaveSettings)
    Vue.component('readapt-close-settings', CloseSettings)
  },
  CompositionApi
}

export { ColorPicker, RangeBar, SelectPercentage, LanguageSelector, SettingsLeaveConfirmation, SettingsSaveConfirmation, SaveSettings, CloseSettings }
