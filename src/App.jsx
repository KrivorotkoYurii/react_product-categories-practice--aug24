/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const COLUMNS = ['ID', 'Product', 'Category', 'User'];
const OWNER_DEFAULT_VALUE = 'all';

const productsUnited = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categoryFromServer => categoryFromServer.id === product.categoryId,
  );
  const user = usersFromServer.find(
    userFromServer => userFromServer.id === category.ownerId,
  );

  return { ...product, category, user };
});

const getFilteredProducts = (products, { ownerFilter, nameFilter }) => {
  let filteredProducts = [...products];

  if (ownerFilter !== OWNER_DEFAULT_VALUE) {
    filteredProducts = filteredProducts.filter(
      product => product.user.name === ownerFilter,
    );
  }

  const normalizedFilter = nameFilter.toLowerCase();

  if (normalizedFilter) {
    filteredProducts = filteredProducts.filter(product => {
      const normalizedProduct = product.name.toLowerCase();

      return normalizedProduct.includes(normalizedFilter);
    });
  }

  return filteredProducts;
};

export const App = () => {
  const [ownerFilter, setOwnerFilter] = useState(OWNER_DEFAULT_VALUE);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const visibleProducts = getFilteredProducts(productsUnited, {
    ownerFilter,
    nameFilter,
  });

  const handleResetFilters = () => {
    setOwnerFilter(OWNER_DEFAULT_VALUE);
    setNameFilter('');
  };

  const handleAddCategory = categoryFromServer => {
    setSelectedCategories(categories => [...categories, categoryFromServer]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={ownerFilter === OWNER_DEFAULT_VALUE && 'is-active'}
                onClick={() => setOwnerFilter(OWNER_DEFAULT_VALUE)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setOwnerFilter(user.name)}
                  className={user.name === ownerFilter && 'is-active'}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  value={nameFilter}
                  onChange={event => {
                    setNameFilter(event.target.value);
                  }}
                  type="text"
                  className="input"
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {nameFilter !== '' && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setNameFilter('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategories(categoriesFromServer)}
              >
                All
              </a>

              {categoriesFromServer.map(categoryFromServer => {
                return (
                  <a
                    key={categoryFromServer.id}
                    data-cy="Category"
                    className="button mr-2 my-1"
                    href="#/"
                    onClick={() => handleAddCategory(categoryFromServer)}
                  >
                    {categoryFromServer.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {COLUMNS.map(column => (
                    <th key={column}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {column}
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={visibleProducts.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
