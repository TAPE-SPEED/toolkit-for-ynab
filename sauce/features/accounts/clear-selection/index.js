import { Feature } from 'toolkit/core/feature';

export class ClearSelection extends Feature {
  uncheckTransactions = () => {
    let accountsController = ynabToolKit.shared.containerLookup('controller:accounts');

    try {
      accountsController.get('areChecked').setEach('isChecked', 0);
      let gridHeader = ynabToolKit.shared.getEmberView($('.ynab-grid-header').attr('id'));
      gridHeader.childViews[0].set('isChecked', false);
      accountsController.send('closeModal');
    } catch (e) {
      accountsController.send('closeModal');
      ynabToolKit.shared.showFeatureErrorModal('Clear Selection');
    }
  }

  observe = (changedNodes) => {
    if (changedNodes.has('ynab-u modal-popup modal-account-edit-transaction-list ember-view modal-overlay active')) {
      this.invoke();
    }
  }

  invoke = () => {
    const menuText = ynabToolKit.l10nData && ynabToolKit.l10nData['toolkit.accountsClearSelection'] || 'Clear Selection';

    // Note that ${menuText} was intentionally placed on the same line as the <i> tag to
    // prevent the leading space that occurs as a result of using a multi-line string.
    // Using a dedent function would allow it to be placed on its own line which would be
    // more natural.
    //
    // The second <li> functions as a separator on the menu after the feature menu item.
    $('.modal-account-edit-transaction-list .modal-list')
      .prepend(
        $(`<li>
            <button class="button-list ynab-toolkit-clear-selection">
              <i class="flaticon stroke minus-2"></i>${menuText}
            </button>
          </li>
          <li><hr /><li>`).click(() => {
            this.uncheckTransactions();
          })
      );
  }
}
